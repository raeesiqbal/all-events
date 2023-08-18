import image1 from "../../assets/images/carousel-img-1.svg";
import image2 from "../../assets/images/carousel-img-2.svg";
import image3 from "../../assets/images/carousel-img-3.svg";
import image4 from "../../assets/images/carousel-img-4.svg";

export const images = [image1, image2, image3, image4];

const imageByIndex = (index) => images[index % images.length];

export default imageByIndex;
