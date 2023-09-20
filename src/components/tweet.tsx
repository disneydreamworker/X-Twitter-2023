import { styled } from "styled-components";
import { useState } from "react";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { DateTimeFormatOptions } from "intl";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const UpdateButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  border: 1px solid white;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const CreatedAt = styled.span`
  margin: none;
  text-align: right;
  font-size: 12px;
`;

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  createdAt,
}: ITweet) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부를 관리할 상태 추가
  const [updatedTweet, setUpdatedTweet] = useState(tweet); // 업데이트된 트윗 내용을 관리할 상태 추가

  const onDelete = async () => {
    const ok = confirm("트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onUpdate = async () => {
    if (!user || user.uid !== userId) return;
    try {
      const tweetRef = doc(db, "tweets", id); // 업데이트할 데이터를 객체로 생성
      const updatedData = {
        tweet: updatedTweet, // 원하는 새로운 트윗 내용으로 변경
      };
      await updateDoc(tweetRef, updatedData); // 수정된 트윗 내용으로 업데이트
      setIsEditing(false); // 수정 모드 종료
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const formatCreatedAt = (date: Date) => {
    const options: DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  };

  const createdAtDate = new Date(createdAt);

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>

        {isEditing ? (
          <TextArea
            required
            rows={5}
            maxLength={180}
            value={updatedTweet}
            onChange={(e) => setUpdatedTweet(e.target.value)}
          />
        ) : (
          <Payload>
            {tweet}
            <br />
            <CreatedAt>{formatCreatedAt(createdAtDate)}</CreatedAt>
          </Payload>
        )}
        {user?.uid === userId ? (
          <div>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            {"\t"}
            {isEditing ? (
              <UpdateButton onClick={onUpdate}>Save</UpdateButton>
            ) : (
              <UpdateButton onClick={() => setIsEditing(true)}>
                Edit
              </UpdateButton>
            )}
          </div>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
