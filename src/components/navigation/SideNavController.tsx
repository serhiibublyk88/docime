import { SideNav } from "../layout/SideNav/SideNav";
import { Header } from "../layout/Header/Header";
import { useSideNav } from "../../hooks/useSideNav";
import { GroupCreationModal } from "../../components";

export const SideNavController: React.FC = () => {
  const sideNav = useSideNav();

  return (
    <>
      {/* ✅ Хедер получает обработчики переключения меню */}
      <Header
        onLeftMenuToggle={sideNav.setIsLeftMenuOpen}
        onRightMenuToggle={sideNav.setIsRightMenuOpen}
        shouldShowBurgers={sideNav.shouldShowBurgers}
        shouldShowRightBurger={sideNav.shouldShowRightBurger} // ✅ Теперь правый бургер работает стабильно
      />

      {/* ✅ Левое меню теперь скрывается на мобилке, но открывается по бургеру */}
      {sideNav.user && sideNav.isLeftMenuOpen && (
        <SideNav
          position="left"
          isOpen={sideNav.isLeftMenuOpen}
          onClose={sideNav.setIsLeftMenuOpen}
          items={sideNav.leftMenuItems}
        />
      )}

      {/* 🔥 Фикс: теперь правое меню не появляется само по себе, но бургер работает */}
      {sideNav.user && sideNav.isRightMenuOpen && (
        <SideNav
          position="right"
          isOpen={sideNav.isRightMenuOpen}
          onClose={sideNav.setIsRightMenuOpen}
          items={sideNav.rightMenuItems}
        />
      )}

      {/* ✅ Модалка создания группы */}
      {sideNav.user && sideNav.isGroupModalOpen && (
        <GroupCreationModal
          isOpen={sideNav.isGroupModalOpen}
          onClose={() => sideNav.setIsGroupModalOpen(false)}
        />
      )}
    </>
  );
};
