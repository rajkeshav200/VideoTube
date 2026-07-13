import { useState } from "react";
import api from "../api/axios";

export default function ChangePassword() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmpass,setConfirmpass] = useState("");

  const submit = async () => {
    try {
      await api.put("/user/changepassword", {
        oldPassword: oldPass,
        newPassword: newPass,
        confirmnewPass:confirmpass
      });
      alert("Password updated");
      setOldPass("")
      setNewPass("")
      setConfirmpass("")
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password")
    }
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
