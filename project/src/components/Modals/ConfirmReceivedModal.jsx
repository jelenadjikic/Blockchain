import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import web3 from '../../ethereum/web3'
import PurchaseContract from '../../ethereum/purchase'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Button} from '@mui/material/';
import VerifiedIcon from '@mui/icons-material/Verified';

function ConfirmReceivedModal({purchase}) {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  
  const [valueInEther, setValueInEther] = useState(0)

   // Use Effect
   useEffect(() => {
    const convertValueToEther = async () => {
        let valEther = await web3.utils.fromWei(purchase.value, 'ether')
        setValueInEther(valEther)
    }
    convertValueToEther()
  }, []);

  // ConfirmPurchase
  const confirm = (e) => {
    
    e.preventDefault()

    const confirmReceived = async () => {
      try{
        const accounts = await web3.eth.getAccounts()
        const purchaseInstance = PurchaseContract(purchase.address);

        await purchaseInstance.methods.confirmReceived()
            .send({
                from: accounts[0], 
                gas: 6000000
            });    
        toast.success("You have successfully confirmed that item has arrived!")
        window.location.reload(true);
      }
      catch(err){
        toast.error(err)
      }
       
    }
    
    confirmReceived()
    toggle()
  }

  return (
    <div>
      <VerifiedIcon onClick = {toggle}>
        Confirm received
      </VerifiedIcon>
      <Modal isOpen={modal} toggle={toggle}  >
        <ModalHeader toggle={toggle}>Confirm received</ModalHeader>
        <ModalBody>
         Are you sure you want to confirm that this item has arrived?
         If you proceed to confirm, your deposit of {valueInEther.toString()} ETH will be put back into your account!
        </ModalBody>
        <ModalFooter>
        <Button variant="outlined" size="medium" color="success" style={{marginRight: "10px"}} onClick = {confirm}>
            Confirm received
        </Button>
        <Button variant="outlined" size="medium" color="error" onClick = {toggle}>
            Cancel
        </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ConfirmReceivedModal;