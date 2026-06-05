export const updateProfile = async (data: any) => {
  return { success: true, data };
};

export const getProfile = async () => {
  return {
    id: "1",
    fullName: "Lê Minh Tiến",
    email: "minhtien.le@example.com",
    dob: "15/12/2002",
    plan: "free",
  };
};
