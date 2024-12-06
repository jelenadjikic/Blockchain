import React, { useState } from 'react';
import { toast } from 'react-toastify'
import web3 from '../../ethereum/web3'
import PurchaseContract from '../../ethereum/purchase'
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Button} from '@mui/material/';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function AbortModal({purchase}) {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

    // Abort
    const abort = (e) => {

        e.preventDefault()
    
        const abortPurchase = async () => {
          try{
            const accounts = await web3.eth.getAccounts()
            const purchaseInstance = PurchaseContract(purchase.address);
            await purchaseInstance.methods.abort()
                .send({
                    from: accounts[0], 
                    gas: 6000000
                });    
            toast.success("You have successfully aborted this item!")
            window.location.reload(true);
          }
          catch(err){
            toast.error(err)
          }
           
        }
    
        abortPurchase()
        toggle()
      }

  return (
    <div>
      <DeleteForeverIcon color="action" onClick = {toggle}>
        Abort
      </DeleteForeverIcon>
     
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Abort confirmation</ModalHeader>
        <ModalBody>
         Are you sure you want to abort this purchase? 
         If you proceed to abort, this item will no longer be up for sale and the deposit will be returned to your account!
        </ModalBody>
        <ModalFooter>
        <Button variant="outlined" size="medium" color="success"  style={{marginRight: "10px"}}  onClick = {abort}>
            Abort
        </Button>
        <Button variant="outlined" size="medium" color="error" onClick = {toggle}>
            Cancel
        </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AbortModal;