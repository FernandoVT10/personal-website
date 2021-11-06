import React, { useState, useEffect, useRef, Dispatch } from "react";

import { imageValidator } from "@/utils/validators";
import getImageURLs from "@/utils/getImageURLs";

import { Actions } from "../reducer";

export type ImageObject = {
  _id: string
  imageSpecs: {
    width: number
    url: string
  }[]
}

type IImage = {
  id: string
  file: File
  imageURL: string
}

interface HookProps {
  imagesObjects: ImageObject[]
  dispatch: Dispatch<Actions>
}

const getTheBiggestImage = (imageSpecs: ImageObject["imageSpecs"]): string => {
  let width = 0;
  let url = "";

  imageSpecs.forEach(imageSpec => {
    if(imageSpec.width > width) {
      width = imageSpec.width;
      url = imageSpec.url;
    }
  });

  return url;
}

const useImagesEditor = ({ imagesObjects, dispatch }: HookProps) => {
  const [images, setImages] = useState<IImage[]>(
    imagesObjects.map(image => ({
      id: image._id,
      file: null,
      imageURL: getTheBiggestImage(image.imageSpecs)
    }))
  );
  const [imagesIdsToDelete, setImagesIdsToDelete] = useState<string[]>([]);

  const [currentPreviewImage, setCurrentPreviewImage] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentId = useRef(0);

  useEffect(() => {
    const imagesFiles: File[] = [];

    images.forEach(image => {
      if(image.file) imagesFiles.push(image.file);
    });

    dispatch({ type: "set-images-editor-data", payload: {
      newImages: imagesFiles,
      imagesIdsToDelete
    }});
  }, [images, imagesIdsToDelete]);

  const addImages = async (files: FileList) => {
    if(!files.length) return;

    const fileArray: File[] = [];

    for(let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if(!imageValidator(file.type)) return setErrorMessage("All files must be images");

      fileArray.push(file);
    }

    setLoading(true);

    const imageURLs = await getImageURLs(fileArray);

    const newImages: IImage[] = [];

    for(let i = 0; i < fileArray.length; i++) {
      newImages.push({
        id: currentId.current.toString(),
        file: fileArray[i],
        imageURL: imageURLs[i]
      });

      currentId.current++;
    }

    setCurrentPreviewImage(images.length + newImages.length - 1);
    setErrorMessage("");
    setImages(prevImages => prevImages.concat(newImages));
    setLoading(false);
  }

  const deleteImage = (imageId: string) => {
    const image = images.find(image => image.id === imageId);

    // if the file is null we need to add it to the 'imagesIdsToDelete' array to delete it from the server
    if(!image.file) {
      setImagesIdsToDelete(prevImagesIds => [...prevImagesIds, image.id]);
    }

    setImages(
      images.filter(image => image.id !== imageId)
    );

    if(currentPreviewImage > images.length - 2) {
      setCurrentPreviewImage(currentPreviewImage - 1);
    }
  }

  const handleOnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addImages(e.dataTransfer.files);
  }

  return {
    addImages,
    currentPreviewImage, setCurrentPreviewImage,
    deleteImage,
    errorMessage,
    handleOnDrop,
    images,
    isDragging, setIsDragging,
    loading
  };
}

export default useImagesEditor;
