import {
  SideNav,
  Header,
  GroupCreationModal,
  QuestionModal,
} from "../components";
import { useSideNav } from "../hooks";
import { Question } from "../types/reduxTypes";

// ✅ Добавляем тип для пропсов
interface SideNavControllerProps {
  onAddQuestion: (question: Omit<Question, "id">) => void;
}

// ✅ Теперь `SideNavController` принимает `onAddQuestion`
export const SideNavController: React.FC<SideNavControllerProps> = ({
  onAddQuestion,
}) => {
  const sideNav = useSideNav(onAddQuestion); // ✅ Передаём `onAddQuestion` в `useSideNav`

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
          show={sideNav.isGroupModalOpen}
          onClose={() => sideNav.setIsGroupModalOpen(false)}
        />
      )}

      {/* 🔹 Подключаем модалку для создания вопросов */}
      {sideNav.openQuestionType && (
        <QuestionModal
          isOpen={!!sideNav.openQuestionType}
          onClose={() => sideNav.setOpenQuestionType(null)}
          onSave={sideNav.handleSaveQuestion} // ✅ Теперь передаём `handleSaveQuestion`
          type={sideNav.openQuestionType}
        />
      )}
    </>
  );
};
