import { GeneratePodcastProps } from "@/types";
import React, { use, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const [isAiPodcast, setIsAiPodcast] = useState(false);
  const audioRef = useRef<HTMLInputElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const handleAudio = async (blob: Blob, fileName: string) => {
    const file = new File([blob], fileName, { type: "audio/mpeg" });

    const uploaded = await startUpload([file]);
    const storageId = (uploaded[0].response as any).storageId;

    props.setAudioStorageId(storageId);

    const audioUrl = await getAudioUrl({ storageId });
    props.setAudio(audioUrl!);
    setIsGenerating(false);
    toast({
      title: "Podcast generated successfully",
    });
  };

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));

      handleAudio(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({ title: "Error uploading image", variant: "destructive" });
    }
  };

  const generatePodcast = async () => {
    setIsGenerating(true);
    props.setAudio("");

    if (!props.voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate a podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: props.voiceType,
        input: props.voicePrompt,
      });
      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      handleAudio(blob, fileName);
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiPodcast(true)}
          className={cn("", {
            "bg-black-6": isAiPodcast,
          })}
        >
          Use AI to generate podcast
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiPodcast(false)}
          className={cn("", {
            "bg-black-6": !isAiPodcast,
          })}
        >
          Upload custom podcast
        </Button>
      </div>
      {isAiPodcast ? (
        <div>
          <div className="flex flex-col gap-2.5 pt-5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Podcast
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate audio"
              rows={5}
              value={props.voicePrompt}
              onChange={(e) => props.setVoicePrompt(e.target.value)}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
              onClick={generatePodcast}
            >
              {isGenerating ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => audioRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={audioRef}
            onChange={(e) => uploadAudio(e)}
          />
          {!isGenerating ? (
            <img
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              MP3, AAC, WAV, etc
            </p>
          </div>
        </div>
      )}
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </>
  );
};

export default GeneratePodcast;
