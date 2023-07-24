"use client";

import { useState } from "react";

const ShowImage = () => {
  const [imageObjectURL, setImageObjectURL] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [ifSelected, setSelected] = useState(false);

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImageObjectURL(objectURL as any);
      setImageFile(event.target.files[0]);
      setSelected(true);
    }
  };

  return { imageObjectURL, imageFile, handleImageChange, ifSelected };
};

export default ShowImage;
