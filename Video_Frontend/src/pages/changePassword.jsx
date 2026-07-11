import { useState } from "react";
import api from "../api/axios";

export default function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmpass,setConfirmpass] = useState("");

  const submit = async () => {
    await api.put("/user/changepassword", {
      oldPassword: oldPass,
      newPassword: newPass,
      confirmnewPass:confirmpass
    });
    alert("Password updated");
    setOldPass("")
    setNewPass("")
    setConfirmpass("")
  };

  return (
    <div>
      <input placeholder="Old password" onChange={e => setOldPass(e.target.value)} />
      <input placeholder="New password" onChange={e => setNewPass(e.target.value)} />
      <input placeholder="confirmpassword" onChange={e => setConfirmpass(e.target.value)} />
      <button onClick={submit}>Change</button>
    </div>
  );
}
