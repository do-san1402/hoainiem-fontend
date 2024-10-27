import NavbarSkeleton from "@/components/skeleton/NavbarSkeleton";
import fetcher from "@/utils/fetcher";
import { useTheme } from "next-themes";
import Link from "next/link";
import useSWR from "swr";

interface MenuContent {
  menu_content_id: number;
  content_type: string;
  content_id: number;
  menu_position: number;
  menu_lavel: string;
  link_url: string | null;
  slug: string;
  parents_id: number;
  menu_id: number;
  status: number;
  menu_name: string;
  menu_style: string | null;
  categorieslevelone?: MenuContent[];
}

const organizeMenus = (data: MenuContent[]): MenuContent[] => {
  const menuMap = new Map<number, MenuContent>();
  data.forEach((item) => {
    menuMap.set(item.menu_content_id, { ...item });
  });

  data.forEach((item) => {
    if (item.categorieslevelone && item.categorieslevelone.length > 0) {
      const parent = menuMap.get(item.menu_content_id);
      if (parent) {
        parent.categorieslevelone = item.categorieslevelone;
      }
    }
  });

  return Array.from(menuMap.values()).filter(
    (item) =>
      !data.some((parent) =>
        parent.categorieslevelone?.some(
          (child) => child.menu_content_id === item.menu_content_id
        )
      )
  );
};

const NavItems = ({
  activeMenu,
  setActiveMenu,
}: {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}) => {
  const { data, error, isLoading } = useSWR<MenuContent[]>("/category-list", fetcher);
  const { theme } = useTheme();

  if (error) return <div className="hidden lg:block">Error loading data</div>;
  if (isLoading) return <NavbarSkeleton theme={theme} />;
  const organizedMenus = organizeMenus(data || []);
  return (
    <nav className="flex-nowrap overflow-x-auto lg:flex-wrap hidden lg:block">
      <div className="flex flex-wrap items-center lg:justify-center">
        <ul className="flex gap-1 whitespace-nowrap lg:overflow-hidden">
          {organizedMenus.map((category) => {
            const { menu_content_id, slug, menu_lavel, categorieslevelone } = category;
            return (
              <li key={menu_content_id} className="group text-black dark:text-white z-0">
                <Link
                  href={`/${slug?.toLowerCase()}`}
                  onClick={() => {
                    setActiveMenu(menu_lavel.toLowerCase());
                  }}
                  className="flex items-center gap-1 py-2 px-1 text-xs text-[var(--dark)] dark:text-white font-bold capitalize hover:opacity-65"
                >
                  <div
                    className={`${activeMenu === menu_lavel.toLowerCase()
                      ? "font-bold border-b-2 border-black dark:border-white"
                      : ""
                      }`}
                  >
                    {menu_lavel.toUpperCase()}
                  </div>
                  {categorieslevelone && categorieslevelone.length > 0 && (
                    <svg
                      className="w-2.5 h-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  )}
                </Link>

                {/* Dropdown menu */}
                {categorieslevelone && categorieslevelone.length > 0 && (
                  <ul className="absolute hidden group-hover:block z-10 w-100 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700">
                    {categorieslevelone.map((subCategory) => (
                      <li key={subCategory.menu_content_id}>
                        <Link
                          href={`/${subCategory.slug?.toLowerCase()}`}
                          onClick={() => setActiveMenu(subCategory.menu_lavel.toLowerCase())}
                          className="block px-2 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white capitalize"
                        >
                          {subCategory.menu_lavel.toLowerCase()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>




  );
};

export default NavItems;
