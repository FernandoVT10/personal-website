const getImageURLs = async (files: File[]) => {
  const imageURLs = [];

  for(let index = 0; index < files.length; index++) {
    const data = await new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader;

      fileReader.onload = e => resolve(e.target.result.toString());

      fileReader.onerror = e => reject(e);

      fileReader.readAsDataURL(files[index]);
    });

    imageURLs.push(data);
  }

  return imageURLs;
}

export default getImageURLs;
