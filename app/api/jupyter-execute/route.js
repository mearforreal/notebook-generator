import { JUPYTER_WS } from '@/lib/jupyter-server';
import crypto from 'crypto';
import WebSocket from 'ws';

// Strip ANSI codes from traceback strings
function stripAnsi(s) {
  return String(s).replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * POST /api/jupyter-execute
 * Body: { kernelId: string, code: string, cellId: number }
 *
 * Returns a Server-Sent Events stream:
 *   event: output   → partial cell output (stream / result / display / error)
 *   event: reply    → execution_reply (execution_count, status)
 *   event: done     → kernel returned to idle
 *   event: error    → WebSocket / network error
 */
export async function POST(request) {
  const { kernelId, code, cellId } = await request.json();

  if (!kernelId || code === undefined) {
    return new Response(JSON.stringify({ error: 'Missing kernelId or code' }), { status: 400 });
  }

  const encoder = new TextEncoder();
  const msgId = crypto.randomUUID().replace(/-/g, '');

  const stream = new ReadableStream({
    start(controller) {
      function send(event, payload) {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`));
        } catch { /* controller already closed */ }
      }

      function close() {
        try { controller.close(); } catch { /* already closed */ }
      }

      const ws = new WebSocket(`${JUPYTER_WS}/api/kernels/${kernelId}/channels`);

      // Timeout safety: close if kernel takes > 5 min
      const safetyTimer = setTimeout(() => {
        send('error', { cellId, message: 'Execution timed out (5 min)' });
        ws.terminate();
        close();
      }, 300_000);

      ws.on('open', () => {
        ws.send(JSON.stringify({
          header: {
            msg_id  : msgId,
            msg_type: 'execute_request',
            username: 'notebook-studio',
            session : msgId,
            date    : new Date().toISOString(),
            version : '5.3'
          },
          parent_header: {},
          metadata     : {},
          content      : {
            code,
            silent          : false,
            store_history   : true,
            user_expressions: {},
            allow_stdin     : false
          },
          buffers : [],
          channel : 'shell'
        }));
      });

      ws.on('message', (rawData) => {
        let msg;
        try { msg = JSON.parse(rawData.toString()); } catch { return; }

        const { msg_type, parent_header, content } = msg;

        // Only handle messages from our request (status is broadcast to all)
        const ours = parent_header?.msg_id === msgId;

        switch (msg_type) {
          case 'stream':
            if (!ours) return;
            send('output', { cellId, output_type: 'stream', name: content.name, text: content.text });
            break;

          case 'execute_result':
            if (!ours) return;
            send('output', { cellId, output_type: 'execute_result', data: content.data, execution_count: content.execution_count });
            break;

          case 'display_data':
          case 'update_display_data':
            if (!ours) return;
            send('output', { cellId, output_type: 'display_data', data: content.data });
            break;

          case 'error':
            if (!ours) return;
            send('output', {
              cellId,
              output_type: 'error',
              ename      : content.ename,
              evalue     : content.evalue,
              traceback  : (content.traceback || []).map(stripAnsi).join('\n')
            });
            break;

          case 'execute_reply':
            if (!ours) return;
            send('reply', { cellId, execution_count: content.execution_count, status: content.status });
            break;

          case 'status':
            // Idle after OUR request = we're done
            if (ours && content.execution_state === 'idle') {
              clearTimeout(safetyTimer);
              send('done', { cellId });
              ws.close();
              close();
            }
            break;
        }
      });

      ws.on('error', (err) => {
        clearTimeout(safetyTimer);
        send('error', { cellId, message: `WebSocket error: ${err.message}` });
        close();
      });

      ws.on('close', () => {
        clearTimeout(safetyTimer);
        close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type'     : 'text/event-stream',
      'Cache-Control'    : 'no-cache',
      'Connection'       : 'keep-alive',
      'X-Accel-Buffering': 'no'    // disable nginx buffering if proxied
    }
  });
}
