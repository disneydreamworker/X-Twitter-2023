import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

// auth.currentUser 함수를 통해 로그인이 된 상태의 유저라면 React.ReactNode 함수의 children 으로 가고
// 로그인이 아닌 상태 =>  user 정보 없이 null 값이면 login 페이지로 navigate 한다
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
