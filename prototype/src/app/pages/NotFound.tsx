import { Link } from "react-router";
import { Button } from "../components/UI";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
        <FileQuestion className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-kanit font-bold mb-2">404 - ไม่พบหน้าที่ต้องการ</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        ขออภัย ไม่พบหน้าที่คุณกำลังมองหา อาจเป็นเพราะ URL ไม่ถูกต้อง หรือหน้านี้ถูกลบออกไปแล้ว
      </p>
      <Link to="/">
        <Button size="lg">กลับหน้าแรก</Button>
      </Link>
    </div>
  );
}
