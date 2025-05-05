import { BiCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import { IoReorderFourSharp } from "react-icons/io5";
import { MdTableBar } from "react-icons/md";
import { SlidersHorizontal, User } from "lucide-react";

const sidebardata = [
  {
    title: "Ангилал",
    icon: <BiCategoryAlt />,
    link: "/category",
  },
  {
    title: "Дэд ангилал",
    icon: <MdCategory />,
    link: "/subcategory",
  },
  {
    title: "Бараа",
    icon: <FaBoxes />,
    link: "/product",
  },
  {
    title: "Компани",
    icon: <BiDetail />,
    link: "/company",
  },
  {
    title: "Захиалга",
    icon: <IoReorderFourSharp />,
    link: "/order",
  },
  {
    title: "Ширээ",
    icon: <MdTableBar />,
    link: "/table",
  },
  {
    title: "Слаядэр",
    icon: <SlidersHorizontal />,
    link: "/slider",
  },
  {
    title: "Хэрэглэгч нэмэх",
    icon: <User />,
    link: "/user",
    role: "merchant",
  },
];

export default sidebardata;
