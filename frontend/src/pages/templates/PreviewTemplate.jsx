"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  TypographyH2,
  TypographyH5,
  TypographyMuted,
} from "@/components/custom/Typography";
import { Card } from "@/components/ui/card";
import { templateService } from "@/services/templateService";

const PreviewTemplate = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await templateService.getTemplate(id);
        setTemplate(data);
      } catch (err) {
        toast.error("Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!template) return <p>Template not found.</p>;

  return (
    <div className="space-y-6">
      <TypographyH2>{template.title}</TypographyH2>

      <Card className="p-4 md:p-6">
        {/* Body */}
        <div className="prose max-w-full whitespace-pre-wrap mb-4">
          <div dangerouslySetInnerHTML={{ __html: template.body }} />
        </div>

        {/* Attachments */}
        {template.attachments?.length > 0 && (
          <div className="space-y-4">
            <TypographyH5>Attachments</TypographyH5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {template.attachments.map((file, i) => {
                const url = `/api/templates/file/${file.fileId || file._id}`;

                const isImage = file.contentType?.startsWith("image/");
                const isPDF = file.contentType === "application/pdf";

                return (
                  <div
                    key={i}
                    className="border rounded p-2 flex flex-col gap-2"
                  >
                    <span className="text-sm truncate">{file.filename}</span>

                    {isImage && (
                      <img
                        src={url}
                        alt={file.filename}
                        className="max-h-40 w-full object-cover rounded border"
                      />
                    )}

                    {isPDF && (
                      <iframe
                        src={url}
                        title={file.filename}
                        className="w-full h-48 border rounded"
                      />
                    )}

                    {!isImage && !isPDF && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        Download
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PreviewTemplate;
