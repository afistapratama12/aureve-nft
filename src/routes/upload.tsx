import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Video, Music, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

type AssetType = "image" | "video" | "audio" | "document";

interface UploadFormData {
  file: File | null;
  title: string;
  description: string;
  price: string;
  royalty: string;
  assetType: AssetType | null;
}

function UploadPage() {
  const navigate = useNavigate();
  const { isConnected, openModal } = useWallet();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UploadFormData>({
    file: null,
    title: "",
    description: "",
    price: "0.1",
    royalty: "10",
    assetType: null,
  });

  // Check if wallet is connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        <Card className="max-w-md bg-white/[0.03] border-white/[0.08]">
          <CardHeader>
            <CardTitle className="text-white">Wallet Not Connected</CardTitle>
            <CardDescription className="text-gray-400">
              Please connect your wallet to upload and mint NFTs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => openModal()} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const detectAssetType = (file: File): AssetType => {
    const type = file.type;
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";
    return "document";
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const assetType = detectAssetType(file);
    setFormData((prev) => ({ ...prev, file, assetType }));

    // Generate preview
    if (assetType === "image" || assetType === "video") {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title) {
      alert("Please fill in all required fields");
      return;
    }

    setIsUploading(true);
    
    try {
      // TODO: Implement actual upload logic
      // 1. Upload to IPFS via Pinata
      // 2. Create lazy mint voucher
      // 3. Save to Supabase
      
      console.log("Uploading:", formData);
      
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Navigate to marketplace
      alert("Asset uploaded successfully!");
      navigate({ to: "/marketplace" });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getAssetIcon = (type: AssetType | null) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-8 h-8" />;
      case "video":
        return <Video className="w-8 h-8" />;
      case "audio":
        return <Music className="w-8 h-8" />;
      case "document":
        return <FileText className="w-8 h-8" />;
      default:
        return <Upload className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] py-12">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Create New NFT</h1>
          <p className="text-gray-400">
            Upload your digital asset and set pricing to mint as NFT
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - File Upload */}
            <div className="space-y-6">
              <Card className="bg-white/[0.03] border-white/[0.08]">`
                <CardHeader>
                  <CardTitle>Upload Asset</CardTitle>
                  <CardDescription>
                    Supported: Images, Videos, Audio, Documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Drop Zone */}
                  <motion.div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 transition-all",
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                      formData.file && "border-primary"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
                  >
                    <input
                      type="file"
                      id="file-input"
                      className="hidden"
                      onChange={handleFileInputChange}
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    />

                    {!formData.file ? (
                      <label
                        htmlFor="file-input"
                        className="flex flex-col items-center gap-4 cursor-pointer"
                      >
                        <div className="p-4 rounded-full bg-muted">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium mb-1">
                            Drop your file here, or{" "}
                            <span className="text-primary">browse</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Max file size: 100MB
                          </p>
                        </div>
                      </label>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              {getAssetIcon(formData.assetType)}
                            </div>
                            <div>
                              <p className="font-medium">{formData.file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                file: null,
                                assetType: null,
                              }));
                              setPreview(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Preview */}
                        {preview && (
                          <div className="rounded-lg overflow-hidden bg-muted">
                            {formData.assetType === "image" ? (
                              <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-64 object-cover"
                              />
                            ) : formData.assetType === "video" ? (
                              <video
                                src={preview}
                                controls
                                className="w-full h-64"
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details Form */}
            <div className="space-y-6">
              <Card className="bg-white/[0.03] border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-white">Asset Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Provide information about your NFT
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">`
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Amazing Digital Art"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us more about your asset..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (ETH) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.1"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Set the price per NFT edition
                    </p>
                  </div>

                  {/* Royalty */}
                  <div className="space-y-2">
                    <Label htmlFor="royalty">
                      Royalty (%) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="royalty"
                      type="number"
                      step="0.1"
                      min="0"
                      max="50"
                      placeholder="10"
                      value={formData.royalty}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          royalty: e.target.value,
                        }))
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll receive this percentage on secondary sales
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card className="bg-white/[0.03] border-white/[0.08]">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/[0.05] space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Platform Fee</span>
                        <span className="font-medium text-white">1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Your Royalty</span>
                        <span className="font-medium text-white">{formData.royalty}%</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={!formData.file || !formData.title || isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Create NFT
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By creating, you agree to our terms and conditions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
