"use client";

import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/*
 * CUSTOM UPLOAD ADAPTER FIX:
 * This component now includes a custom upload adapter to fix the
 * "filerepository-no-upload-adapter" error that occurs when using
 * CKEditor Classic build with image uploads.
 *
 * The custom adapter works with the existing /api/upload_image endpoint
 * and doesn't require any additional CKEditor plugins or custom builds.
 */

interface CKEditorComponentProps {
  data: string;
  onChange: (event: any, editor: any) => void;
  config?: any; // Optional extra config
}

// Custom Upload Adapter Class
class CustomUploadAdapter {
  private loader: any;
  private url: string;
  private xhr: XMLHttpRequest | null = null;

  constructor(loader: any) {
    this.loader = loader;
    this.url = "/api/upload_image"; // Your API endpoint
  }

  // Starts the upload process
  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  // Aborts the upload process
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", this.url, true);
    xhr.responseType = "json";

    // Add any necessary headers here
    // xhr.setRequestHeader("X-CSRF-TOKEN", "csrf-token");
    // xhr.setRequestHeader("Accept", "application/json");
  }

  // Initializes XMLHttpRequest listeners
  _initListeners(resolve: any, reject: any, file: File) {
    const xhr = this.xhr;
    if (!xhr) return;

    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request
  _sendRequest(file: File) {
    if (!this.xhr) return;

    const data = new FormData();
    data.append("upload", file);
    this.xhr.send(data);
  }
}

// Upload adapter plugin
function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader);
  };
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  data,
  onChange,
  config,
}) => {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [editorInstance, setEditorInstance] = useState<any>(null);

  /*
   * NOTE: Full CKBox integration requires a custom CKEditor build with the CKBox plugin.
   * The classic build doesn't include CKBox by default.
   *
   * To create a custom build with CKBox:
   * 1. Follow the instructions at: https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/quick-start.html#building-the-editor-from-source
   * 2. Include @ckeditor/ckeditor5-ckbox in your build
   * 3. Replace the ClassicEditor import with your custom build
   */

  // Default configuration with Custom Upload Adapter
  const defaultConfig = {
    extraPlugins: [CustomUploadAdapterPlugin],
    // Remove simpleUpload as we're using custom adapter
    /* 
    // CKBox configuration for when using a custom build
    ckbox: {
      tokenUrl: "/api/ckbox-token",
      serviceOrigin: process.env.NEXT_PUBLIC_CKBOX_SERVICE_ORIGIN || "https://your-ckbox-instance.ckbox.cloud",
    },
    */
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
      ],
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage", // Add link image option
      ],
      styles: {
        options: [
          {
            name: "side",
            className: "image-style-side",
            title: "Side image",
            modelElements: ["imageBlock"],
          },
          {
            name: "inline",
            className: "image-style-inline",
            title: "Inline image",
            modelElements: ["imageInline"],
          },
          {
            name: "block",
            className: "image-style-block",
            title: "Centered image",
            modelElements: ["imageBlock"],
            isDefault: true,
          },
        ],
      },
    },
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "uploadImage",
        // "ckbox", // Uncomment when using custom build with CKBox
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "|",
        "undo",
        "redo",
      ],
    },
  };

  const mergedConfig = {
    ...defaultConfig,
    ...config,
    image: {
      ...defaultConfig.image,
      ...(config?.image || {}),
    },
    // Ensure extraPlugins are merged properly
    extraPlugins: [
      ...(defaultConfig.extraPlugins || []),
      ...(config?.extraPlugins || []),
    ],
  };

  // Log any image upload failures for debugging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("CKEditor") ||
        event.message.includes("upload")
      ) {
        console.error("CKEditor error:", event);
        setUploadStatus(`Error: ${event.message}`);
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  // Debug upload events
  const handleCKEditorInit = (editor: any) => {
    console.log("CKEditor initialized");
    setEditorInstance(editor);

    // Test if all required plugins are loaded
    console.log("Available plugins:", Array.from(editor.plugins.names()));

    // Check if FileRepository is available and has upload adapter
    const fileRepository = editor.plugins.get("FileRepository");
    if (fileRepository) {
      console.log("FileRepository plugin is available");
      console.log("Custom upload adapter should be configured");
      setUploadStatus("Upload adapter ready");
    } else {
      console.error("FileRepository plugin is not available");
      setUploadStatus("Error: FileRepository not found");
    }

    // Check if CKBox plugin is available
    if (editor.plugins.has("CKBox")) {
      console.log("CKBox plugin is available");

      // Listen for CKBox events
      editor.plugins.get("CKBox").on("open", () => {
        console.log("CKBox opened");
        setUploadStatus("CKBox file manager opened");
      });

      editor.plugins.get("CKBox").on("close", () => {
        console.log("CKBox closed");
        setUploadStatus("");
      });
    } else {
      console.warn(
        "CKBox plugin is not available. Using custom upload adapter instead."
      );
    }

    // Setup event listeners for file upload
    if (fileRepository) {
      fileRepository.on("uploadStart", (evt: any, file: any) => {
        console.log("Upload started:", file);
        setUploadStatus("Upload started");
      });

      fileRepository.on("uploadProgress", (evt: any, file: any) => {
        console.log("Upload progress:", file.uploadedPercent);
        setUploadStatus(`Uploading: ${Math.round(file.uploadedPercent)}%`);
      });

      fileRepository.on("uploadSuccess", (evt: any, file: any) => {
        console.log("Upload success:", file);
        console.log("Response data:", file.responseData);

        // Verify the response contains the URL
        if (file.responseData && file.responseData.url) {
          console.log("Image URL:", file.responseData.url);
        } else {
          console.error("Upload response missing URL:", file.responseData);
        }

        setUploadStatus("Upload complete!");
      });

      fileRepository.on("uploadError", (evt: any, file: any) => {
        console.error("Upload error:", file.error);
        setUploadStatus(`Upload failed: ${file.error || "Unknown error"}`);
      });
    }
  };

  // Handle manual file selection
  const handleManualFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Manual upload logic would be here if needed
    }
  };

  return (
    <div className="ckeditor-container">
      <CKEditor
        editor={ClassicEditor}
        // @ts-ignore: the shipped d.ts is missing `data`
        data={data}
        onChange={(event, editor) => {
          console.log("Editor content:", editor.getData());
          onChange(event, editor);
        }}
        config={mergedConfig}
        onReady={handleCKEditorInit}
        onError={(error: any) => {
          console.error("CKEditor error:", error);
          setUploadStatus(`Editor error: ${error.message || "Unknown error"}`);
        }}
      />
    </div>
  );
};

export default CKEditorComponent;

/*
 * INSTRUCTIONS FOR IMPLEMENTING CKBOX:
 *
 * 1. Sign up for CKBox service at https://ckeditor.com/ckbox/
 *
 * 2. Create a custom CKEditor build with CKBox plugin:
 *    - npm install --save @ckeditor/ckeditor5-ckbox
 *    - Create a custom build following: https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/quick-start.html#building-the-editor-from-source
 *    - Include CKBox in your plugins list
 *
 * 3. Update your .env.local file with:
 *    CKBOX_TOKEN=your-ckbox-token
 *    NEXT_PUBLIC_CKBOX_SERVICE_ORIGIN=https://your-ckbox-instance.ckbox.cloud
 *
 * 4. Implement a proper token endpoint (app/api/ckbox-token/route.ts) that generates
 *    secure tokens following: https://ckeditor.com/docs/ckbox/latest/guides/authentication/token.html
 *
 * 5. Uncomment the CKBox configuration in defaultConfig and add "ckbox" to the toolbar items
 *
 * 6. Replace ClassicEditor import with your custom build
 */
