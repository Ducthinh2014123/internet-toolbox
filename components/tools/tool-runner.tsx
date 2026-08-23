"use client";

import * as React from "react";
import { getToolById } from "@/lib/tools-registry";
import { useRecentTools } from "@/lib/hooks/use-local-storage-list";
import { TextIOTool } from "@/components/tools/text-io-tool";
import { FormTool } from "@/components/tools/form-tool";

// Client component that receives only a serializable slug and looks the tool
// definition (including its functions) up from the registry itself. This
// avoids passing functions across the Server -> Client Component boundary.
export function ToolRunner({ slug }: { slug: string }) {
  const tool = getToolById(slug);
  const { pushRecent } = useRecentTools();

  React.useEffect(() => {
    if (tool) pushRecent(tool.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool?.id]);

  if (!tool) {
    return <p className="text-sm text-destructive">Tool not found.</p>;
  }

  if (tool.componentType === "text-io" && tool.modes) {
    return (
      <TextIOTool
        modes={tool.modes}
        placeholder={tool.placeholder}
        sample={tool.sample}
        downloadExt={tool.downloadExt}
        downloadMime={tool.downloadMime}
      />
    );
  }

  if (
    (tool.componentType === "form" ||
      tool.componentType === "image" ||
      tool.componentType === "qr" ||
      tool.componentType === "barcode") &&
    tool.run
  ) {
    return <FormTool fields={tool.fields ?? []} run={tool.run} downloadExt={tool.downloadExt} downloadMime={tool.downloadMime} />;
  }

  return (
    <p className="text-sm text-muted-foreground">
      This tool type is not available in this build yet.
    </p>
  );
}
