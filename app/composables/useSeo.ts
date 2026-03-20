export default function useSeo(
  title: string,
  description: string,
  image: string = "https://ybiwqilvsxrnsjboenek.supabase.co/storage/v1/object/public/images/thumbnail.png",
) {
  const url = useRequestURL();

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogUrl: url.href,
    ogSiteName: "NuxtLearn",
    ogImage: image,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  });
}
