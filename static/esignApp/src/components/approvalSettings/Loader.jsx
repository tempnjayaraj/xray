import React, {
    useContext,
    useRef,
    useEffect,
    Fragment,
    useCallback,
    useState,
  } from "react";
  import Modal, { ModalBody, ModalTransition } from "@atlaskit/modal-dialog";
  import CircularProgress from "@material-ui/core/CircularProgress";
  import { invoke, requestJira } from "@forge/bridge";
  
  function Loader(props) {
    const { isLoader } = props;
    const [isOpen, setIsOpen] = useState(false);
    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);
    return (
      <div>
        <ModalTransition>
          {isLoader && (
            <Modal width={80} height={80} backdrop="static">
              <ModalBody>
                <CircularProgress
                  style={{ marginLeft: -10, marginTop: 10 }}
                  size={40}
                  status={"loading"}
                />
              </ModalBody>
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
  export default Loader;
  