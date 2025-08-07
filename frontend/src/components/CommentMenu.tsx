import { PopoutMenu } from "./PopoutMenu";
import { EllipsisVertical } from "lucide-react";

export const CommentMenu = ({
    isEditing,
    onEdit,
    onDelete,
}: {
    isEditing: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) => (
    <PopoutMenu
        width="w-32"
        trigger={<EllipsisVertical className="w-5 h-5 text-gray-500 hover:text-gray-800" />}
        align="right"
    >
        <div>
            {!isEditing ? (
                <>
                    <button onClick={onEdit} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        Edit
                    </button>
                    <button onClick={onDelete} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                        Delete
                    </button>
                </>
            ) : (
                <></>
            )}
        </div>
    </PopoutMenu>
);
