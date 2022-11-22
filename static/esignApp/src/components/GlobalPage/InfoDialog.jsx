import {
  useCallback,
  useState,
} from "react";
import Button from "@atlaskit/button/standard-button";

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";

function InfoDialog(props) {
  const { isInfoDialog, onDeleteCategoryOpen, data, infoTitle } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <ModalTransition>
        {isInfoDialog && (
          <Modal
            onClose={() => {
              onDeleteCategoryOpen(false);
            }}
          >
            <ModalHeader>
              <ModalTitle appearance="warning">{infoTitle}</ModalTitle>
            </ModalHeader>
            <ModalBody>{data}</ModalBody>
            <ModalFooter>
              <Button
                appearance="warning"
                onClick={() => {
                  onDeleteCategoryOpen(false);
                }}
                autoFocus
              >
                OK
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}
export default InfoDialog;
