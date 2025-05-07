import { BiCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { BiDetail } from "react-icons/bi";
import { MdTableBar } from "react-icons/md";
import { SlidersHorizontal, User ,ChartBarStacked ,LayoutTemplate} from "lucide-react";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
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
    icon: <NotificationsActiveIcon />,
    link: "/order",
    showBadge: true, 
  },
  {
    title: "Ширээ",
    icon: <MdTableBar />,
    link: "/table",
  },
  {
    title: "Слаядэр",
    icon: <SlidersHorizontal size={16}/>,
    link: "/slider",
  },
  {
    title: "Хэрэглэгч нэмэх",
    icon: <User size={16}/>,
    link: "/user",
    role: "merchant",
  },
  {
    title: "Ширээ категори",
    icon: <ChartBarStacked size={16}/>,
    link: "/tablecategory",
  },
  {
    title: "Template",
    icon: <LayoutTemplate size={16}/>,
    link: "/template",
  },
];

export default sidebardata;
