import styled from "styled-components";

export const Container = styled.div`
  padding: 2.5rem 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  font-family: "Outfit", "Inter", system-ui, sans-serif;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;

  h1 {
    font-size: 2.75rem;
    font-weight: 800;
    color: #1a365d;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  p {
    font-size: 1.15rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;

  .search-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 1.5rem;
  }

  input {
    width: 100%;
    padding: 1.15rem 1.15rem 1.15rem 3.5rem;
    border-radius: 1.25rem;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

    &:focus {
      outline: none;
      border-color: #1a365d;
      box-shadow: 0 10px 15px -3px rgba(26, 54, 93, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const CategoryFilter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

export const CategoryChip = styled.button<{ $active?: boolean }>`
  padding: 0.6rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(props) => (props.$active ? "#1a365d" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#1a365d" : "white")};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  transition: all 0.2s;

  &:hover {
    border-color: #1a365d;
    color: ${(props) => (props.$active ? "white" : "#1a365d")};
    transform: translateY(-1px);
  }
`;

export const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FAQItem = styled.div<{ $isOpen: boolean }>`
  background: white;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) =>
    props.$isOpen ? "0 10px 25px -5px rgba(0, 0, 0, 0.05)" : "none"};

  &:hover {
    border-color: ${(props) => (props.$isOpen ? "#1a365d" : "#cbd5e1")};
  }
`;

export const QuestionBox = styled.div`
  padding: 1.25rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.4;
  }

  .toggle-icon {
    font-size: 1.5rem;
    color: #94a3b8;
    transition: transform 0.3s;
  }
`;

export const AnswerBox = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  padding: ${(props) => (props.$isOpen ? "0 1.75rem 1.5rem" : "0 1.75rem")};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #475569;
  line-height: 1.7;
  font-size: 1rem;

  p {
    margin: 0;
  }

  strong {
    color: #1a365d;
  }
`;

export const ContactSection = styled.div`
  margin-top: 5rem;
  padding: 3rem;
  background: #f8fafc;
  border-radius: 2rem;
  text-align: center;
  border: 1px dashed #e2e8f0;

  h4 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 0.75rem;
  }

  p {
    color: #64748b;
    margin-bottom: 2rem;
  }
`;

export const PrimaryButton = styled.button`
  background: #1a365d;
  color: white;
  padding: 0.85rem 2.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(26, 54, 93, 0.2);

  &:hover {
    background: #152c4d;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(26, 54, 93, 0.3);
  }
`;
