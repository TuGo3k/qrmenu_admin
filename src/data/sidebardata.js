import { BiCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import { IoReorderFourSharp } from "react-icons/io5";
import { MdTableBar } from "react-icons/md";
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
    // items: [
    //   { "title": "Үдийн хоол", "link": "/lunch" },
    //   { "title": "Оройн хоол", "link": "/dinner" },
    //   { "title": "Өглөөний цай", "link": "/breakfast" },
    //   { "title": "Түргэн хоол", "link": "/fastfood" },
    //   { "title": "Кофе / Цай / Уух зүйл", "link": "/drink" },
    //   { "title": "Амттан", "link": "/desert" },
    //   { "title": "Цагаан хоол", "link": "/vegan" },
    //   { "title": "Монгол хоол", "link": "/tradition" },
    //   { "title": "Ази хоол", "link": "/asia" },
    //   { "title": "Европ хоол", "link": "/europe" },
    //   { "title": "BBQ / Шорлог", "link": "/bbq" }
    // ]
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
];

export default sidebardata;
