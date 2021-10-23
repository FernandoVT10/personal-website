export type ImageSpec = {
  width: number
  url: string
}

interface ResponsiveImageProps {
  imageSpecs: ImageSpec[],
  sizes?: string
  style: React.CSSProperties
  alt: string
}

const ResponsiveImage = ({ imageSpecs, sizes, style, alt }: ResponsiveImageProps) => {
  let srcSet = "";
  imageSpecs.forEach((imageSpec, index) => {
    // if it's the last element we must not add a comma
    const comma = index === imageSpecs.length - 1 ? "" : ",";
    srcSet += `${imageSpec.url} ${imageSpec.width}w${comma}`;
  });

  return (
    <img
      src={imageSpecs[0]?.url}
      srcSet={srcSet}
      sizes={sizes}
      loading="lazy"
      style={style}
      alt={alt}
    />
  );
}

export default ResponsiveImage;
