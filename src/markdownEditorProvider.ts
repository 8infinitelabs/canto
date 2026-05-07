import * as vscode from 'vscode'

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'canto.markdownEditor'

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MarkdownEditorProvider(context)
    return vscode.window.registerCustomEditorProvider(MarkdownEditorProvider.viewType, provider, {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false,
    })
  }

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')],
    }
    webviewPanel.webview.html = this.getHtml(webviewPanel.webview)

    // Track the last content we sent so we don't echo our own edits back
    let lastSentToWebview = ''

    const updateWebview = () => {
      const text = document.getText()
      if (text === lastSentToWebview) return
      lastSentToWebview = text
      webviewPanel.webview.postMessage({ type: 'update', text })
    }

    const changeSub = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        updateWebview()
      }
    })

    webviewPanel.onDidDispose(() => changeSub.dispose())

    webviewPanel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'edit': {
          lastSentToWebview = message.text
          const edit = new vscode.WorkspaceEdit()
          edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            message.text
          )
          await vscode.workspace.applyEdit(edit)
          break
        }
        case 'ready':
          updateWebview()
          break
      }
    })
  }

  private getHtml(webview: vscode.Webview): string {
    const nonce = getNonce()
    const cspSource = webview.cspSource
    const vditorBase = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'vditor')
    )

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 img-src ${cspSource} data: blob:;
                 style-src ${cspSource} 'unsafe-inline';
                 script-src 'nonce-${nonce}' ${cspSource};
                 font-src ${cspSource} data:;
                 worker-src blob:;" />
  <link rel="stylesheet" href="${vditorBase}/index.css" />
  <style>
    html, body { margin: 0; padding: 0; height: 100%; background: transparent; }
    #vditor { height: 100vh; }
    .vditor { border: none !important; border-radius: 0 !important; }
    .vditor-toolbar {
      border-bottom: 1px solid var(--vscode-editorGroup-border) !important;
      background: var(--vscode-editor-background) !important;
    }
    .vditor-reset, .vditor-ir, .vditor-wysiwyg, .vditor-sv {
      background: var(--vscode-editor-background) !important;
      color: var(--vscode-editor-foreground) !important;
    }
  </style>
</head>
<body>
  <div id="vditor"></div>
  <script nonce="${nonce}" src="${vditorBase}/index.min.js"></script>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    let vditor = null;
    let pendingContent = null;
    let vditorReady = false;
    let debounceTimer = null;

    function detectTheme() {
      return document.body.classList.contains('vscode-dark') ||
             document.body.classList.contains('vscode-high-contrast')
        ? 'dark' : 'classic';
    }

    vditor = new Vditor('vditor', {
      cdn: '${vditorBase}',
      mode: 'wysiwyg',
      height: '100vh',
      theme: detectTheme(),
      preview: {
        theme: { current: detectTheme() === 'dark' ? 'dark' : 'light' },
        hljs: { style: detectTheme() === 'dark' ? 'github-dark' : 'github' },
      },
      cache: { enable: false },
      toolbar: [
        'headings', 'bold', 'italic', 'strike', '|',
        'line', 'quote', 'list', 'ordered-list', 'check', '|',
        'code', 'inline-code', 'link', 'table', '|',
        'undo', 'redo', '|',
        'edit-mode', 'preview', 'outline',
      ],
      input: (value) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          vscode.postMessage({ type: 'edit', text: value });
        }, 150);
      },
      after: () => {
        vditorReady = true;
        if (pendingContent !== null) {
          vditor.setValue(pendingContent);
          pendingContent = null;
        }
        vscode.postMessage({ type: 'ready' });
      },
    });

    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.type === 'update') {
        if (!vditorReady) {
          pendingContent = msg.text;
        } else if (vditor.getValue() !== msg.text) {
          vditor.setValue(msg.text);
        }
      }
    });
  </script>
</body>
</html>`
  }
}

function getNonce(): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
