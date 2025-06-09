
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { WidgetConfig } from '../widget/WidgetConfiguration';

interface EmbedCodeGeneratorProps {
  config: WidgetConfig;
}

export const EmbedCodeGenerator = ({ config }: EmbedCodeGeneratorProps) => {
  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    const configJson = JSON.stringify(config, null, 2);
    return `<!-- ChatWidget Pro Embed Code -->
<script>
  window.ChatWidgetConfig = ${configJson};
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;
  };

  const embedCode = generateEmbedCode();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>
          Copy this code and paste it before the closing &lt;/body&gt; tag on your website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={embedCode}
            readOnly
            className="font-mono text-sm min-h-[200px] resize-none"
          />
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Integration Instructions:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Copy the embed code above</li>
            <li>Paste it before the closing &lt;/body&gt; tag on your website</li>
            <li>The widget will automatically load with your current configuration</li>
            <li>Test the widget to ensure it's working correctly</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};
