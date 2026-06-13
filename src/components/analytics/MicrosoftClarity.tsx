import Script from "next/script";

/** Microsoft Clarity project ID for Life Guardian session recordings and heatmaps. */
const CLARITY_PROJECT_ID = "x6e8gwa34f";

/**
 * Loads Microsoft Clarity analytics after the page becomes interactive.
 * Disabled in development to avoid polluting analytics and keep local dev fast.
 */
export function MicrosoftClarity() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`,
      }}
    />
  );
}
