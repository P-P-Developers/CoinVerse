import Swal from "sweetalert2";

export const commandAlert = ({
  type = "info",
  title = "",
  text = "",
  icon = "",
  timer = 1800,
  showLoading = false,
}) => {
  let iconHtml = "";
  if (icon === "success")
    iconHtml =
      '<svg width="32" height="32" fill="#16a34a" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f0fdf4"/><path d="M7 13l3 3 7-7" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>';
  else if (icon === "error")
    iconHtml =
      '<svg width="32" height="32" fill="#dc2626" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff1f2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>';
  else if (icon === "warn")
    iconHtml =
      '<svg width="32" height="32" fill="#f59e42" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff7ed"/><path d="M12 8v4m0 4h.01" stroke="#f59e42" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>';
  else if (icon === "trade")
    iconHtml =
      '<svg width="32" height="32" fill="#2563eb" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3" fill="#e0e7ef"/><path d="M8 16l3-3 2 2 3-4" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>';
  else iconHtml = "";

  Swal.fire({
    position: "top-end",
    iconHtml,
    title,
    text,
    showConfirmButton: false,
    timer,
    background:
      type === "success"
        ? "#f0fdf4"
        : type === "error"
        ? "#fff1f2"
        : "#f8fafc",
    color:
      type === "success"
        ? "#166534"
        : type === "error"
        ? "#b91c1c"
        : "#1e293b",
    toast: true,
    customClass: { popup: "swal2-trading-popup" },
    willOpen: showLoading ? () => Swal.showLoading() : undefined,
  });
};
