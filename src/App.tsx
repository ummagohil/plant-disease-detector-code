import { useState, useCallback, useEffect } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { AnalysisDisplay } from "./components/AnalysisDisplay";
import { analyzePlantImage } from "./services/geminiService";
import { fileToBase64 } from "./utils/imageUtils";
import {
  LeafIcon,
  UploadCloudIcon,
  SparklesIcon,
  AlertTriangleIcon,
  XCircleIcon,
} from "./components/IconComponents";

const App = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up object URL when component unmounts or image changes
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleImageSelect = useCallback(
    (file: File) => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError(null);
    },
    [imagePreviewUrl]
  );

  const handleClearImage = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, [imagePreviewUrl]);

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const base64Data = await fileToBase64(imageFile);
      const result = await analyzePlantImage(base64Data, imageFile.type);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      if (err instanceof Error) {
        setError(
          `Failed to analyze plant: ${err.message}. Ensure your API key is correctly configured.`
        );
      } else {
        setError("An unknown error occurred during analysis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-leaf-light via-green-50 to-lime-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <LeafIcon className="w-12 h-12 text-primary mr-3" />
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800">
            PlantDoc AI
          </h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Upload a plant image to diagnose diseases or check its health.
        </p>
      </header>

      <main className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-6 sm:p-8 space-y-6">
        <ImageUploader
          onImageSelect={handleImageSelect}
          imagePreviewUrl={imagePreviewUrl}
          onClearImage={handleClearImage}
          disabled={isLoading}
        />

        {imageFile && (
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !imageFile}
            className="w-full flex items-center justify-center bg-primary hover:bg-leaf-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                Analyze Plant
              </>
            )}
          </button>
        )}

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <AlertTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              </div>
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        <AnalysisDisplay
          result={analysisResult}
          isLoading={isLoading && !error && !analysisResult} // Show loading specific to analysis part
        />
      </main>
    </div>
  );
};

export default App;
