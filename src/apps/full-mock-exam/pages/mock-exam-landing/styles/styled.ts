import styled from "styled-components";

// Device breakpoints
const breakpoints = {
  mobile: "768px",
  tablet: "1024px",
};

export const Container = styled.div`
  // padding: 2.5rem 1.5rem;
  // max-width: 1240px;
  margin: 0 auto;
  font-family:
    "Inter",
    -apple-system,
    sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1rem;
  }
`;

export const HeroBanner = styled.div`
  background-color: #1a365d;
  background-image: radial-gradient(
    circle at 2px 2px,
    rgba(255, 255, 255, 0.05) 1px,
    transparent 0
  );
  background-size: 24px 24px;
  border-radius: 1.5rem;
  padding: 3rem;
  color: white;
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 2.5rem;
    padding: 2rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(26, 54, 93, 0) 0%,
      rgba(26, 54, 93, 0.8) 100%
    );
    z-index: 1;
  }

  /* Abstract Geometric Decoration */
  &::after {
    content: "";
    position: absolute;
    right: -2rem;
    top: -2rem;
    width: 300px;
    height: 300px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 40%;
    transform: rotate(15deg);
    z-index: 0;
  }

  .banner-left {
    position: relative;
    z-index: 2;
    h1 {
      font-size: 2.5rem;
      font-weight: 900;
      color: white;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;

      @media (max-width: ${breakpoints.mobile}) {
        font-size: 1.8rem;
      }
    }
    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1.1rem;
      margin: 0;

      @media (max-width: ${breakpoints.mobile}) {
        font-size: 0.95rem;
      }
    }
  }

  .banner-right {
    position: relative;
    z-index: 2;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    border-radius: 1.25rem;
    min-width: 400px;

    @media (max-width: ${breakpoints.mobile}) {
      min-width: 100%;
      width: 100%;
      padding: 1.25rem;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.5rem;

      .stat-item {
        .val {
          display: block;
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          line-height: 1;

          @media (max-width: ${breakpoints.mobile}) {
            font-size: 1.8rem;
          }
        }
        .label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 0.5rem;
        }
      }
    }
  }
`;

export const TargetProgressWidget = styled.div`
  .progress-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);

    .target {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .progress-rail {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: white;
      border-radius: 3px;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    }
  }
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2.5rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const TestListSection = styled.div`
  .tabs-nav {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;

    @media (max-width: ${breakpoints.mobile}) {
      gap: 1rem;
    }

    button {
      padding: 0.75rem 0;
      background: none;
      border: none;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      position: relative;
      transition: color 0.2s;
      white-space: nowrap;

      &.active {
        color: #1a365d;
        &::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #1a365d;
        }
      }
      &:hover:not(.active) {
        color: #334155;
      }
    }
  }
`;

export const TestCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.25rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &:hover {
    border-color: #1a365d;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .index {
    font-size: 1rem;
    font-weight: 700;
    color: #94a3b8;
    width: 45px;

    @media (max-width: ${breakpoints.mobile}) {
      width: auto;
      margin-right: 0.5rem;
    }
  }

  .info {
    flex: 1;

    @media (max-width: ${breakpoints.mobile}) {
      flex: none;
      width: calc(100% - 40px);
    }

    .top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.25rem;
      flex-wrap: wrap;

      h3 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 800;
        color: #1a365d;
      }
    }
    .meta {
      color: #64748b;
      font-size: 0.85rem;
      font-weight: 600;
    }
  }

  .score-display {
    text-align: right;
    margin-right: 2rem;

    @media (max-width: ${breakpoints.mobile}) {
      margin-right: 0;
      text-align: left;
      flex: 1;
    }

    .big {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1a365d;
      span {
        font-size: 0.9rem;
        color: #94a3b8;
        font-weight: 600;
      }
    }
  }

  .status-tag {
    padding: 0.2rem 0.6rem;
    border-radius: 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    background: #f1f5f9;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .difficulty {
    padding: 0.2rem 0.6rem;
    border-radius: 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
  }
`;

export const SidebarCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem;
  }

  h4 {
    font-size: 0.85rem;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
  }
`;

export const SkillBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;

  .label {
    width: 85px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #334155;
  }

  .bar-container {
    flex: 1;
    height: 6px;
    background: #f1f5f9;
    border-radius: 3px;
    overflow: hidden;

    .fill {
      height: 100%;
      background: #1a365d;
      border-radius: 3px;
      opacity: 0.8;
    }
  }

  .score {
    width: 25px;
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a365d;
    text-align: right;
  }
`;

export const HistoryList = styled.div`
  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 0;
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
      border: none;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 1rem;
      .date {
        font-size: 0.85rem;
        color: #94a3b8;
        font-weight: 600;
      }
      .name {
        font-size: 0.9rem;
        font-weight: 700;
        color: #1a365d;
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      .cefr {
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 800;
        background: #f8fafc;
        color: #64748b;
        border: 1px solid #e2e8f0;
      }
      .score {
        font-size: 0.9rem;
        font-weight: 800;
        color: #1a365d;
      }
    }
  }
`;

export const ActionButton = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }

  &.ghost {
    background: transparent;
    border: 1px solid #e2e8f0;
    color: #64748b;
    &:hover {
      border-color: #1a365d;
      color: #1a365d;
    }
  }

  &.primary {
    background: #1a365d;
    color: white;
    border: none;
    &:hover {
      background: #152c4d;
    }
  }
`;
