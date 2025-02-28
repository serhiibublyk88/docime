import { SideNav } from "../layout/SideNav/SideNav";
import { Header } from "../layout/Header/Header";
import { useSideNav } from "../../hooks/useSideNav";
import { GroupCreationModal } from "../../components";

export const SideNavController: React.FC = () => {
  const sideNav = useSideNav();

  return (
    <>
      <Header
        onLeftMenuToggle={sideNav.setIsLeftMenuOpen}
        onRightMenuToggle={sideNav.setIsRightMenuOpen}
        shouldShowBurgers={sideNav.shouldShowBurgers}
        shouldShowRightBurger={sideNav.shouldShowRightBurger}
      />

      {sideNav.user && sideNav.isLeftMenuOpen && (
        <SideNav
          position="left"
          isOpen={sideNav.isLeftMenuOpen}
          onClose={sideNav.setIsLeftMenuOpen}
          items={sideNav.leftMenuItems}
        />
      )}

      {sideNav.user && sideNav.isRightMenuOpen && (
        <SideNav
          position="right"
          isOpen={sideNav.isRightMenuOpen}
          onClose={sideNav.setIsRightMenuOpen}
          items={sideNav.rightMenuItems}
        />
      )}

      {sideNav.user && sideNav.isGroupModalOpen && (
        <GroupCreationModal
          isOpen={sideNav.isGroupModalOpen}
          onClose={() => sideNav.setIsGroupModalOpen(false)}
        />
      )}
    </>
  );
};
