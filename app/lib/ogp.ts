const cloudinaryConfig = {
  cloudName: "koki-develop",
  cardId: "OGP Messenger/card",
  fontId: "Sawarabi Gothic",
};

export const buildOgpImageUrl = (text: string): string | null => {
  const trimmedText = text.trim();
  if (trimmedText === "") return null;

  const { cloudName, cardId, fontId } = cloudinaryConfig;
  return `https://res.cloudinary.com/${encodeURIComponent(
    cloudName
  )}/image/upload/c_fit,w_1000,h_480,l_text:${encodeURIComponent(
    fontId
  )}_56:${encodeURIComponent(
    encodeURIComponent(trimmedText)
  )}/fl_layer_apply/v1/${encodeURIComponent(cardId)}`;
};
