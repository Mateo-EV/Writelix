import { YouTubeEmbed } from "@next/third-parties/google";

type YoutubeRendererProps = {
  keyYoutube: string;
};

export const YoutubeRenderer = ({ keyYoutube }: YoutubeRendererProps) => {
  return (
    <div className="grid place-items-center p-2">
      <div className="w-full overflow-hidden rounded-lg">
        <YouTubeEmbed videoid={keyYoutube} style="max-width:100%" />
      </div>
    </div>
  );
};
