import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux";
import { fetchGroups } from "../../redux/group/groupActions";

import { Group } from "../../types/apiTypes";

export const GroupsPage = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const groups: Group[] = useSelector((state: RootState) => state.group.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  return (
    <div className="main-content ">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Gruppenverwaltung</h1>
        
      </div>

      {groups.length > 0 ? (
        <ul className="list-group">
          {groups.map((group) => (
            <li key={group.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{group.name}</h5>
                  <p className="mb-1 text-muted">
                    {group.description || "Keine Beschreibung"}
                  </p>
                  <small className="text-muted">
                    Ersteller: {group.createdBy?.username || "Unbekannt"}
                  </small>
                </div>
                <span className="badge bg-secondary">
                  {group.members ? group.members.length : 0} Mitglieder
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Keine Gruppen gefunden.</p>
      )}
    </div>
  );
};
