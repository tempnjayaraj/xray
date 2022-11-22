import React, { useCallback, useState } from "react";

import Button from "@atlaskit/button/standard-button";

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";

function AlertDialog(props) {
  const {
    deleteValue,
    deleteType,
    data,
    isDeleteCategoryOpen,
    onDeleteCategoryOpen,
    onDelete,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  return (
    <div>
      <ModalTransition>
        {isDeleteCategoryOpen && (
          <Modal onClose={() => onDeleteCategoryOpen(false)}>
            <ModalHeader>
              <ModalTitle appearance="danger">Delete {deleteType}</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <p>
                "{deleteValue}" once deleted cannot be retrieved. Are you sure
                you want to perform this action?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                appearance="subtle"
                onClick={() => onDeleteCategoryOpen(false)}
              >
                Cancel
              </Button>
              <Button
                appearance="danger"
                onClick={() => onDelete(deleteType, data)}
                autoFocus
              >
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
export default AlertDialog;
