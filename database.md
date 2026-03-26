BorrowRequest — bảng trung tâm của luồng mượn trả



{

\_id: ObjectId, // id của request mượn



code: String, // mã nghiệp vụ để hiển thị cho người dùng, ví dụ: BR2603ABC



borrowerId: ObjectId, // user tạo yêu cầu mượn

borrowerRole: String, // role tại thời điểm tạo request: 'student' | 'lecturer'



equipmentId: ObjectId, // thiết bị được mượn

roomId: ObjectId, // phòng hiện tại của thiết bị tại lúc mượn, lưu để audit nhanh

scheduleId: ObjectId, // lịch học/lịch dạy đang làm căn cứ quyền mượn tại thời điểm tạo request

classSlotId: ObjectId // request này phát sinh trong slot nào

borrowDate: Date, // thời điểm bắt đầu mượn theo nghiệp vụ; thường là lúc user muốn nhận thiết bị

returnDate: Date, // thời điểm dự kiến trả thiết bị



purpose: String, // mục đích mượn, ví dụ: thuyết trình, học thực hành, kiểm tra thiết bị

note: String, // ghi chú thêm từ người mượn



status: String, // trạng thái nghiệp vụ của request: 'pending' | 'approved' | 'rejected' | 'handed\_over' | 'returned' | 'cancelled'



decisionNote: String, // ghi chú của người duyệt hoặc lý do từ chối / hủy



approvedBy: ObjectId, // admin hoặc người có quyền đã duyệt / từ chối request

approvedAt: Date, // thời điểm duyệt / từ chối



handedOverBy: ObjectId, // người thực tế bàn giao thiết bị

handedOverAt: Date, // thời điểm thiết bị được giao thực tế cho người mượn



returnedConfirmedBy: ObjectId, // người xác nhận đã nhận lại thiết bị

returnedAt: Date, // thời điểm trả thực tế



cancelledBy: ObjectId, // ai hủy request; có thể là requester hoặc admin

cancelledAt: Date, // thời điểm hủy request



createdAt: Date, // thời điểm tạo request

updatedAt: Date, // thời điểm cập nhật gần nhất



}



•  BorrowRequest là nguồn sự thật duy nhất của trạng thái mượn/trả. 

•  Không dùng Equipment.available hay Equipment.borrowed\_by để quyết định đang mượn hay không. 

•  status = approved nghĩa là được phép mượn, nhưng chưa chắc đã giao thiết bị. 

•  status = handed\_over mới nghĩa là đang giữ thiết bị thật. 

•  status = returned mới là đã hoàn tất mượn trả.



1\.	Rule chuyển trạng thái

•	pending -> approved 

•	pending -> rejected 

•	pending -> cancelled 

•	approved -> handed\_over 

•	approved -> cancelled 

•	handed\_over -> returned 

2\.	Không nên cho phép

•	returned -> approved 

•	rejected -> handed\_over 

•	cancelled -> handed\_over



Equipment — bảng tài sản / thiết bị

Bảng này chỉ giữ thông tin thiết bị và tình trạng kỹ thuật hiện tại.

Không giữ trạng thái mượn/trả nghiệp vụ.

{

&#x20; \_id: ObjectId, // id của thiết bị



&#x20; code: String, // mã thiết bị duy nhất, ví dụ: EQ-A101-001

&#x20; name: String, // tên thiết bị, ví dụ: Máy chiếu Epson

&#x20; category: String, // nhóm thiết bị, ví dụ: projector, speaker, laptop, mic



&#x20; roomId: ObjectId, // phòng mà thiết bị đang được gắn / đặt hiện tại



&#x20; status: String, // tình trạng kỹ thuật hiện tại: 'good' | 'broken' | 'maintenance'



&#x20; img: String, // ảnh đại diện thiết bị

&#x20; description: String, // mô tả thêm nếu cần

&#x20; brand: String, // hãng sản xuất nếu cần

&#x20; model: String, // model thiết bị nếu cần



&#x20; createdAt: Date, // thời điểm tạo

&#x20; updatedAt: Date, // thời điểm cập nhật gần nhất

}

3\.	Note quan trọng cho team

•	status ở đây là trạng thái kỹ thuật, không phải trạng thái mượn. 

•	good = thiết bị hoạt động bình thường. 

•	broken = thiết bị đang hỏng. 

•	maintenance = thiết bị đang kiểm tra / bảo trì / sửa chữa. 

•	Không dùng các giá trị như reserved, in\_use trong Equipment.status. 

4\.	Trường nên bỏ khỏi model cũ

available // nên bỏ vì đây là dữ liệu suy ra, không phải dữ liệu gốc

borrowed\_by // nên bỏ vì gây trùng logic với BorrowRequest



5\.	Cách hiểu đúng

•	Thiết bị có thể: 

o	status = good 

o	nhưng vẫn không cho mượn được 

•	Vì còn phải check: 

o	có borrow request active không 

o	user có quyền mượn theo schedule không

3\. Room — bảng phòng học / không gian chứa thiết bị

Bảng này đại diện cho phòng thật ngoài đời.

Thiết bị được gắn vào phòng. Schedule cũng bám theo phòng.

{

&#x20; \_id: ObjectId, // id của phòng



&#x20; name: String, // tên phòng, ví dụ: A101

&#x20; type: String, // loại phòng: 'classroom' | 'lab' | 'office' | 'meeting' | 'other'

&#x20; status: String, // trạng thái phòng: 'available' | 'occupied' | 'maintenance'



&#x20; buildingId: ObjectId, // tòa nhà mà phòng thuộc về

&#x20; floor: Number, // tầng của phòng

&#x20; labels: \[String], // tag mở rộng, ví dụ: \['projector', 'lab', '40-seats']



&#x20; createdAt: Date, // thời điểm tạo

&#x20; updatedAt: Date, // thời điểm cập nhật gần nhất

}

•	Note quan trọng cho team

•	Room là nơi liên kết giữa: 

o	Schedule 

o	Equipment 

o	BorrowRequest 

•	Khi mượn thiết bị, backend phải check: 

o	thiết bị thuộc roomId nào 

o	user có schedule hợp lệ trong đúng room đó không 

•	Nên đổi tên field

Nếu model hiện tại đang là:

building\_id

thì nên chuẩn hóa thành:

buildingId // thống nhất camelCase cho toàn hệ thống



4\. Slot — bảng định nghĩa khung giờ học / ca học

Bảng này dùng để định nghĩa mẫu ca học cố định trong hệ thống.

Nó không đại diện cho một buổi học cụ thể trong ngày, mà chỉ là khung giờ chuẩn để các lịch học tham chiếu tới.

{

&#x20; \_id: ObjectId, // id của slot



&#x20; code: String, // mã slot duy nhất, ví dụ: SLOT\_1, SLOT\_2

&#x20; name: String, // tên slot hiển thị, ví dụ: Ca 1, Ca 2



&#x20; startTime: String, // giờ bắt đầu chuẩn của slot, ví dụ: "07:00"

&#x20; endTime: String, // giờ kết thúc chuẩn của slot, ví dụ: "09:30"



&#x20; order: Number, // thứ tự slot trong ngày để dễ sort, ví dụ: 1, 2, 3, 4



&#x20; isActive: Boolean, // slot còn được sử dụng trong hệ thống hay không



&#x20; createdAt: Date, // thời điểm tạo

&#x20; updatedAt: Date, // thời điểm cập nhật gần nhất

}

•	Note quan trọng cho team

•	Slot chỉ là mẫu khung giờ, không chứa: 

o	phòng học 

o	giảng viên 

o	sinh viên 

o	trạng thái mượn 

•	Slot giúp chuẩn hóa giờ học trong toàn hệ thống. 

•	Không nên hard-code kiểu "Ca 1", "Ca 2" rải rác ở frontend/backend. 

•	startTime và endTime ở đây có thể để String dạng "HH:mm" vì nó là khung giờ mẫu, chưa gắn với ngày cụ thể. 

•	Khi cần sort slot trong ngày, ưu tiên dùng order. 

•	Ví dụ dữ liệu

{

&#x20; code: "SLOT\_1",

&#x20; name: "Ca 1",

&#x20; startTime: "07:00",

&#x20; endTime: "09:30",

&#x20; order: 1,

&#x20; isActive: true

}

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

5 . Schedule — bảng lịch học thực tế dùng để xác minh quyền mượn

Bảng này đại diện cho một buổi học thật diễn ra trong ngày cụ thể.

Đây là bảng dùng để trả lời câu hỏi:

“tại thời điểm hiện tại, user này có đang học / dạy hợp lệ trong phòng đó không?”

{

&#x20; \_id: ObjectId, // id của lịch học



&#x20; title: String, // tên buổi học / buổi dạy, ví dụ: Lập trình Web - nhóm 01



&#x20; date: Date, // ngày diễn ra buổi học, ví dụ: 2026-03-25



&#x20; slotId: ObjectId, // tham chiếu tới slot học chuẩn, ví dụ Ca 1 / Ca 2

&#x20; roomId: ObjectId, // phòng diễn ra buổi học



&#x20; lecturerId: ObjectId, // giảng viên phụ trách buổi học

&#x20; studentIds: \[ObjectId], // danh sách sinh viên tham gia buổi học



&#x20; startAt: Date, // thời điểm bắt đầu thực tế của buổi học (ghép từ date + slot.startTime hoặc lưu trực tiếp)

&#x20; endAt: Date, // thời điểm kết thúc thực tế của buổi học (ghép từ date + slot.endTime hoặc lưu trực tiếp)



&#x20; status: String, // trạng thái lịch: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'



&#x20; createdAt: Date, // thời điểm tạo

&#x20; updatedAt: Date, // thời điểm cập nhật gần nhất

}

•	Note quan trọng cho team

•	Schedule là buổi học thực tế, còn Slot chỉ là khung giờ mẫu. 

•	Schedule phải có: 

o	slotId 

o	roomId 

o	lecturerId 

o	studentIds 

•	Không dùng location: String nữa nếu đã có roomId. 

•	Không dùng user\_id kiểu lịch cá nhân cho bài toán này. 

•	Schedule chỉ dùng để: 

o	xác minh quyền mượn 

o	xác định phòng nào đang có lớp học 

o	biết ai đang học / dạy trong thời điểm hiện tại 

•	Schedule không phải nơi giữ trạng thái mượn/trả. 

•	Cách check quyền mượn

•	Nếu user là lecturer: 

schedule.lecturerId === user.\_id

•	Nếu user là student: 

schedule.studentIds` chứa `user.\_id

•	Và phải đồng thời thỏa: 

schedule.roomId === equipment.roomId

schedule.startAt <= now <= schedule.endAt

schedule.status !== 'cancelled'



5\. User — các trường liên quan đến luồng mượn trả

Không cần liệt kê toàn bộ user profile lúc này.

Chỉ note các field có ảnh hưởng đến workflow mượn trả.

{

&#x20; \_id: ObjectId, // id người dùng



&#x20; username: String, // tài khoản đăng nhập

&#x20; email: String, // email đăng nhập / liên hệ

&#x20; displayName: String, // tên hiển thị



&#x20; role: String, // vai trò hệ thống: 'admin' | 'student' | 'lecturer' | 'technician'

&#x20; isActive: Boolean, // tài khoản còn hoạt động hay không



&#x20; avatarUrl: String, // ảnh đại diện nếu có

&#x20; phone: String, // số điện thoại liên hệ nếu có



&#x20; createdAt: Date, // thời điểm tạo

&#x20; updatedAt: Date, // thời điểm cập nhật gần nhất

}

•	Note quan trọng cho team

•	role quyết định quyền trong workflow: 

o	student: tạo request mượn nếu đang học đúng room/slot 

o	lecturer: tạo request mượn nếu đang dạy đúng room/slot 

o	admin: duyệt / từ chối / bàn giao / xác nhận trả 

o	technician: không phải actor chính của borrow, chủ yếu liên quan report 

•	isActive = false thì không cho tạo request mới 

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

6\. Notification — bảng hỗ trợ luồng mượn trả

Bảng này không phải lõi nghiệp vụ, nhưng rất quan trọng để người dùng biết request đang ở bước nào.

{

&#x20; \_id: ObjectId, // id thông báo



&#x20; userId: ObjectId, // người nhận thông báo



&#x20; type: String, // loại thông báo: 'borrow' | 'approval' | 'return' | 'general'

&#x20; title: String, // tiêu đề thông báo

&#x20; message: String, // nội dung hiển thị



&#x20; read: Boolean, // đã đọc hay chưa



&#x20; action: {

&#x20;   type: String, // hành động khi click: 'none' | 'open\_detail' | 'open\_list' | 'open\_external'

&#x20;   resource: String, // tài nguyên liên quan: 'borrow' | 'notification' | 'equipment'

&#x20;   resourceId: ObjectId, // id của record liên quan, ví dụ BorrowRequest.\_id

&#x20;   payload: Map, // dữ liệu bổ sung nếu cần

&#x20; },



&#x20; createdAt: Date, // thời điểm tạo

&#x20; updatedAt: Date, // thời điểm cập nhật gần nhất

}

•	Note quan trọng cho team

•	Khi tạo borrow request: 

o	gửi thông báo cho admin 

•	Khi request được duyệt / từ chối: 

o	gửi thông báo cho requester 

•	Khi bàn giao: 

o	gửi thông báo cho requester 

•	Khi trả xong: 

o	gửi thông báo cho requester và admin nếu cần 

•	Lưu ý sửa logic cũ

Nếu đang dùng:

this.type

để validate action.resource thì phải cẩn thận, vì type ngoài và action.type là 2 nghĩa khác nhau.





