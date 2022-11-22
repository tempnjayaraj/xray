import React, {
  useContext,
  useRef,
  useEffect,
  Fragment,
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
import { invoke, requestJira } from "@forge/bridge";

function InfoDialog(props) {
  const { isInfoDialog, onDeleteCategoryOpen, data, infoTitle } = props;
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
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
