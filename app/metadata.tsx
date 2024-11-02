// app/metadata.ts
import instance from "@/utils/instance";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await instance.get("/metadata");

  const { title, image, meta_keyword, meta_description, site_name, favicon } = data?.data;
  const faviconWithCacheBuster = `${favicon}?v=${new Date().getTime()}`;

  return {
    title: title,
    description: meta_description,
    keywords: [meta_keyword],
    openGraph: {
      title: title,
      description: meta_description,
      url: site_name,
      siteName: site_name,
      images: [
        {
          url: image,
          secureUrl: image,
          width: 800,
          height: 600,
        },
      ],
      type: "website",
    },
    icons: {
      icon: faviconWithCacheBuster,
    },
  };
}
