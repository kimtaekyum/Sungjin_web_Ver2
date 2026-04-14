import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faPencil,
  faComments,
  faMapLocationDot,
  faFileLines,
  faFire,
  faBookOpen,
  faLightbulb,
  faBullseye,
  faClipboardList,
  faRuler,
  faBook,
  faChartColumn,
  faLandmark,
  faFlask,
  faLocationDot,
  faPhone,
  faClock,
  faSchool,
  faCircleCheck,
  faChartLine,
  faUsers,
  faArrowsRotate,
  faSpinner,
  faXmark,
  faCircleQuestion,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const iconMap: Record<string, IconDefinition> = {
  "graduation-cap": faGraduationCap,
  pencil: faPencil,
  comments: faComments,
  "map-location-dot": faMapLocationDot,
  "file-lines": faFileLines,
  fire: faFire,
  "book-open": faBookOpen,
  lightbulb: faLightbulb,
  bullseye: faBullseye,
  "clipboard-list": faClipboardList,
  ruler: faRuler,
  book: faBook,
  "chart-column": faChartColumn,
  landmark: faLandmark,
  flask: faFlask,
  "location-dot": faLocationDot,
  phone: faPhone,
  clock: faClock,
  school: faSchool,
  "circle-check": faCircleCheck,
  "chart-line": faChartLine,
  users: faUsers,
  sync: faArrowsRotate,
  spinner: faSpinner,
  xmark: faXmark,
  "circle-question": faCircleQuestion,
  "chevron-down": faChevronDown,
};

interface FaIconProps {
  name: string;
  className?: string;
}

export default function FaIcon({ name, className = "" }: FaIconProps) {
  const icon = iconMap[name];
  if (!icon) return null;
  return <FontAwesomeIcon icon={icon} className={className} />;
}
