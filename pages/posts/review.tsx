import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";
import TitleInput from "../../components/editorPlugins/TitleInput";
import EditorContainer, { editorConfig } from "../../containers/editor/EditorContainer";

const NewPostPage: NextPage = () => {
  const { query } = useRouter();

  const restaurantName = query.restaurant as string;
  const restaurantId = query.id;

  if (!restaurantName || !restaurantId)
    return (
      <div>
        <span>올바른 접근이 아닙니다</span>
      </div>
    );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Body>
        <LeftContainer>
          <RestaurantName>{restaurantName}</RestaurantName>
          <TitleInput />
          <EditorContainer restaurant={restaurantName} />
        </LeftContainer>
        <RightContainer></RightContainer>
      </Body>
    </LexicalComposer>
  );
};

const Body = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 60px;
`;

const RestaurantName = styled.h1`
  margin: 0;
  margin-bottom: 10px;
`;

const LeftContainer = styled.div`
  width: 900px;
`;

const RightContainer = styled.div`
  width: 300px;
  border: 1px solid;
`;

export default NewPostPage;
