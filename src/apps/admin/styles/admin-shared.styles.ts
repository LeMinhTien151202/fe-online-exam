import styled from "styled-components";

export const AdminTableWrapper = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  overflow: hidden;
  margin-bottom: 1.5rem;

  .ant-table-wrapper {
    padding: 0 !important;
    margin: 0 !important;
    background: transparent;
  }

  .ant-table-container {
    border: none !important;
    border-radius: 0 !important;
  }

  .ant-table-content {
    border: none !important;
    border-radius: 0 !important;
  }

  .ant-table table {
    width: 100% !important;
    border-collapse: collapse !important;
    border: none !important;
    margin: 0 !important;
  }

  .ant-table-header {
    background: #19355e !important;
    border: none !important;
  }

  /* Header style based on image */
  .ant-table-thead {
    background: #19355e !important;
  }

  .ant-table-thead > tr > th {
    background: #19355e !important;
    border-top: none !important;
    border-radius: 0 !important;
    border-bottom: none !important;
    padding: 12px 16px;
    color: white !important;
    font-weight: 700;
    font-size: 14px;
    border-right: 1px solid rgba(0, 0, 0, 0.45) !important;
    border-bottom: none !important;
    text-align: center;

    &:last-child {
      border-right: none !important;
    }

    &::before {
      display: none !important;
      content: none !important;
      width: 0 !important;
      background: transparent !important;
    }
  }

  .ant-table-tbody > tr > td {
    padding: 10px 16px;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    transition: all 0.2s;
    color: #374151;
    font-size: 13px;

    &:last-child {
      border-right: none;
    }
  }

  /* Index column styling */
  .ant-table-tbody > tr > td:first-child,
  .ant-table-thead > tr > th:first-child {
    text-align: center;
    width: 60px;
  }

  /* TT column (if it's the second column because of rowSelection) */
  .ant-table-selection-column {
    border-right: 1px solid rgba(0, 0, 0, 0.45) !important;
  }

  .ant-table-selection-column + td,
  .ant-table-selection-column + th {
    text-align: center;
    width: 60px;
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #f9fafb;
  }

  .ant-table-row:hover > td {
    background: #f3f4f6 !important;
  }

  /* Status Tag style based on image */
  .custom-status-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 12px;
    border-radius: 4px;
    border: 1px solid #86efac;
    background: #f0fdf4;
    color: #166534;
    font-size: 13px;
    font-weight: 500;
    width: 100%;
    max-width: 110px;
    margin: 0 auto;
  }

  /* Action Buttons style based on image */
  .action-btn {
    width: 28px;
    height: 28px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    background: #fff;
    border-radius: 4px;
    color: #64748b;
    transition: all 0.2s;
    font-size: 14px;

    &:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    &.edit {
      color: #92400e; /* Brownish/Amber */
      background: #fffbeb;
      border-color: #fef3c7;
      &:hover {
        background: #fef3c7;
        border-color: #fde68a;
      }
    }

    &.delete {
      color: #b91c1c;
      background: #fef2f2;
      border-color: #fee2e2;
      &:hover {
        background: #fee2e2;
        border-color: #fecaca;
      }
    }
  }

  .ant-table-placeholder {
    .ant-table-cell {
      padding: 40px 0;
    }
  }
`;

export const AdminPaginationWrapper = styled.div`
  margin-top: 1rem;
`;
