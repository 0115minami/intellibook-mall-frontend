# 电子书文件管理简化方案

## 概述

在没有管理后台的情况下，我们可以通过以下简化方案来管理电子书文件和数据，方便开发和测试。

## 方案一：本地文件系统 + SQL 脚本（推荐用于开发）

### 1. 文件存储结构

在项目根目录创建文件存储目录：

```
intellibook-mall-api/
├── ebook-storage/              # 电子书存储根目录
│   ├── covers/                 # 封面图片
│   │   ├── 1.jpg
│   │   ├── 2.jpg
│   │   └── 3.jpg
│   ├── books/                  # 电子书文件
│   │   ├── pdf/
│   │   │   ├── 1.pdf
│   │   │   ├── 2.pdf
│   │   │   └── 3.pdf
│   │   ├── epub/
│   │   │   ├── 4.epub
│   │   │   └── 5.epub
│   │   └── mobi/
│   │       └── 6.mobi
│   └── README.md               # 文件说明
```

### 2. 配置文件路径

在 `application.properties` 中配置文件存储路径：

```properties
# 电子书文件存储配置
ebook.storage.base-path=ebook-storage
ebook.storage.cover-path=${ebook.storage.base-path}/covers
ebook.storage.book-path=${ebook.storage.base-path}/books

# 文件访问 URL 前缀
ebook.file.url-prefix=/files
```

### 3. 准备测试数据

#### 3.1 下载测试电子书

可以从以下免费资源获取测试用电子书：

- **Project Gutenberg**: https://www.gutenberg.org/ （免费经典文学作品）
- **Open Library**: https://openlibrary.org/ （免费电子书）
- **Internet Archive**: https://archive.org/ （公共领域书籍）

或者使用以下测试文件：
- 创建简单的 PDF 文件（可以用 Word 导出）
- 下载免费的 EPUB 样本

#### 3.2 文件命名规范

```
封面图片: {book_id}.jpg
电子书文件: {book_id}.{format}

示例:
- covers/1.jpg
- books/pdf/1.pdf
- books/epub/2.epub
```

### 4. SQL 数据初始化脚本

创建 `src/main/resources/test-data.sql`：

```sql
-- 插入测试电子书数据

-- 1. Java 编程思想
INSERT INTO tb_ebook (
    book_id, book_title, author, isbn, publisher, publish_date,
    book_intro, category_id, cover_img, file_format, file_path,
    file_size, page_count, original_price, selling_price, tags,
    avg_rating, rating_count, sell_status, is_deleted,
    create_user, create_time, update_user, update_time, detail_content
) VALUES (
    1, 'Java 编程思想（第4版）', 'Bruce Eckel', '9787111213826', '机械工业出版社', '2007-06-01',
    '本书赢得了全球程序员的广泛赞誉，被誉为Java程序员必读的经典著作。', 1,
    'covers/1.jpg', 'PDF', 'books/pdf/1.pdf',
    52428800, 880, 10800, 8800, 'Java,编程,经典',
    4.8, 1250, 0, 0,
    0, NOW(), 0, NOW(),
    '<h2>内容简介</h2><p>本书赢得了全球程序员的广泛赞誉，被誉为Java程序员必读的经典著作。作者以简洁的文字和小而直接的程序示例，讲解了Java语言的各个方面。</p>'
);

-- 2. 深入理解计算机系统
INSERT INTO tb_ebook (
    book_id, book_title, author, isbn, publisher, publish_date,
    book_intro, category_id, cover_img, file_format, file_path,
    file_size, page_count, original_price, selling_price, tags,
    avg_rating, rating_count, sell_status, is_deleted,
    create_user, create_time, update_user, update_time, detail_content
) VALUES (
    2, '深入理解计算机系统（原书第3版）', 'Randal E. Bryant', '9787111544937', '机械工业出版社', '2016-11-01',
    '从程序员的视角深入理解计算机系统，是计算机科学经典著作。', 1,
    'covers/2.jpg', 'PDF', 'books/pdf/2.pdf',
    78643200, 736, 13900, 11900, '计算机系统,经典,必读',
    4.9, 980, 0, 0,
    0, NOW(), 0, NOW(),
    '<h2>内容简介</h2><p>本书从程序员的视角详细阐述计算机系统的本质概念，展示这些概念如何实实在在地影响应用程序的正确性、性能和实用性。</p>'
);

-- 3. 算法导论
INSERT INTO tb_ebook (
    book_id, book_title, author, isbn, publisher, publish_date,
    book_intro, category_id, cover_img, file_format, file_path,
    file_size, page_count, original_price, selling_price, tags,
    avg_rating, rating_count, sell_status, is_deleted,
    create_user, create_time, update_user, update_time, detail_content
) VALUES (
    3, '算法导论（原书第3版）', 'Thomas H. Cormen', '9787111407010', '机械工业出版社', '2012-12-01',
    '算法领域的经典之作，被誉为算法圣经。', 1,
    'covers/3.jpg', 'PDF', 'books/pdf/3.pdf',
    65536000, 1312, 12800, 10800, '算法,数据结构,经典',
    4.7, 1580, 0, 0,
    0, NOW(), 0, NOW(),
    '<h2>内容简介</h2><p>本书深入浅出地介绍了大量的算法及相关的数据结构，以及用于解决这些算法的技术，并着重强调了算法的分析。</p>'
);

-- 4. 三体（EPUB 格式示例）
INSERT INTO tb_ebook (
    book_id, book_title, author, isbn, publisher, publish_date,
    book_intro, category_id, cover_img, file_format, file_path,
    file_size, page_count, original_price, selling_price, tags,
    avg_rating, rating_count, sell_status, is_deleted,
    create_user, create_time, update_user, update_time, detail_content
) VALUES (
    4, '三体', '刘慈欣', '9787536692930', '重庆出版社', '2008-01-01',
    '中国科幻文学的里程碑之作，雨果奖获奖作品。', 2,
    'covers/4.jpg', 'EPUB', 'books/epub/4.epub',
    3145728, 456, 2300, 1800, '科幻,雨果奖,刘慈欣',
    4.9, 25680, 0, 0,
    0, NOW(), 0, NOW(),
    '<h2>内容简介</h2><p>地球文明向宇宙发出第一声啼鸣，取得了意想不到的后果。外星文明"三体"存在于一个三颗恒星的星系中...</p>'
);

-- 5. 活着
INSERT INTO tb_ebook (
    book_id, book_title, author, isbn, publisher, publish_date,
    book_intro, category_id, cover_img, file_format, file_path,
    file_size, page_count, original_price, selling_price, tags,
    avg_rating, rating_count, sell_status, is_deleted,
    create_user, create_time, update_user, update_time, detail_content
) VALUES (
    5, '活着', '余华', '9787506365437', '作家出版社', '2012-08-01',
    '余华代表作，讲述了一个人和他命运之间的友情。', 2,
    'covers/5.jpg', 'EPUB', 'books/epub/5.epub',
    2097152, 256, 2000, 1500, '文学,余华,经典',
    4.8, 18920, 0, 0,
    0, NOW(), 0, NOW(),
    '<h2>内容简介</h2><p>《活着》讲述了一个人和他命运之间的友情，这是最为感人的友情，他们互相感激，同时也互相仇恨...</p>'
);

-- 插入分类数据
INSERT INTO tb_ebook_category (category_id, category_level, parent_id, category_name, category_rank, is_deleted, create_time, create_user, update_time, update_user)
VALUES
(1, 1, 0, '计算机与互联网', 100, 0, NOW(), 0, NOW(), 0),
(2, 1, 0, '文学小说', 99, 0, NOW(), 0, NOW(), 0),
(3, 1, 0, '经济管理', 98, 0, NOW(), 0, NOW(), 0),
(4, 2, 1, 'Java', 10, 0, NOW(), 0, NOW(), 0),
(5, 2, 1, 'Python', 9, 0, NOW(), 0, NOW(), 0),
(6, 2, 1, '算法与数据结构', 8, 0, NOW(), 0, NOW(), 0),
(7, 2, 2, '科幻小说', 10, 0, NOW(), 0, NOW(), 0),
(8, 2, 2, '文学经典', 9, 0, NOW(), 0, NOW(), 0);

-- 插入标签数据
INSERT INTO tb_ebook_tag (tag_id, tag_name, use_count, create_time)
VALUES
(1, 'Java', 1, NOW()),
(2, '编程', 1, NOW()),
(3, '经典', 3, NOW()),
(4, '计算机系统', 1, NOW()),
(5, '算法', 1, NOW()),
(6, '数据结构', 1, NOW()),
(7, '科幻', 1, NOW()),
(8, '雨果奖', 1, NOW()),
(9, '刘慈欣', 1, NOW()),
(10, '文学', 1, NOW()),
(11, '余华', 1, NOW());

-- 插入标签关联
INSERT INTO tb_ebook_tag_relation (relation_id, book_id, tag_id, create_time)
VALUES
(1, 1, 1, NOW()),
(2, 1, 2, NOW()),
(3, 1, 3, NOW()),
(4, 2, 4, NOW()),
(5, 2, 3, NOW()),
(6, 3, 5, NOW()),
(7, 3, 6, NOW()),
(8, 3, 3, NOW()),
(9, 4, 7, NOW()),
(10, 4, 8, NOW()),
(11, 4, 9, NOW()),
(12, 5, 10, NOW()),
(13, 5, 11, NOW()),
(14, 5, 3, NOW());
```

### 5. 文件访问配置

创建静态资源访问配置类：

```java
@Configuration
public class FileAccessConfig implements WebMvcConfigurer {
    
    @Value("${ebook.storage.base-path}")
    private String basePath;
    
    @Value("${ebook.file.url-prefix}")
    private String urlPrefix;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置电子书文件访问路径
        registry.addResourceHandler(urlPrefix + "/**")
                .addResourceLocations("file:" + basePath + "/");
    }
}
```

### 6. 使用步骤

#### 步骤 1: 创建文件目录
```bash
mkdir -p ebook-storage/covers
mkdir -p ebook-storage/books/pdf
mkdir -p ebook-storage/books/epub
mkdir -p ebook-storage/books/mobi
```

#### 步骤 2: 准备测试文件
- 将封面图片放入 `ebook-storage/covers/` 目录
- 将 PDF 文件放入 `ebook-storage/books/pdf/` 目录
- 将 EPUB 文件放入 `ebook-storage/books/epub/` 目录

#### 步骤 3: 执行 SQL 脚本
```bash
# 使用 MySQL 命令行
mysql -u root -p intellibook_mall < src/main/resources/test-data.sql

# 或使用数据库管理工具（Navicat、DBeaver）导入
```

#### 步骤 4: 启动应用测试
```bash
mvn spring-boot:run
```

访问测试：
- 封面图片: `http://localhost:8080/files/covers/1.jpg`
- 电子书列表: `http://localhost:8080/api/v1/ebooks`
- 电子书详情: `http://localhost:8080/api/v1/ebooks/1`

## 方案二：使用数据库管理工具

### 推荐工具

1. **Navicat** (商业软件，功能强大)
2. **DBeaver** (免费开源，推荐)
3. **MySQL Workbench** (MySQL 官方工具)

### 使用 DBeaver 管理电子书数据

#### 1. 连接数据库
- 下载安装 DBeaver: https://dbeaver.io/
- 创建 MySQL 连接
- 连接到 `intellibook_mall` 数据库

#### 2. 直接编辑数据
- 打开 `tb_ebook` 表
- 点击"数据"标签
- 可以直接添加、编辑、删除记录
- 修改后点击"保存"按钮

#### 3. 批量导入数据
- 准备 CSV 文件（Excel 导出）
- 右键点击表 → 导入数据
- 选择 CSV 文件
- 映射字段
- 执行导入

### CSV 模板示例

创建 `ebooks-import.csv`：

```csv
book_title,author,isbn,publisher,publish_date,book_intro,category_id,cover_img,file_format,file_path,file_size,page_count,original_price,selling_price,tags,sell_status
"Java 编程思想","Bruce Eckel","9787111213826","机械工业出版社","2007-06-01","Java程序员必读经典",1,"covers/1.jpg","PDF","books/pdf/1.pdf",52428800,880,10800,8800,"Java,编程,经典",0
"深入理解计算机系统","Randal E. Bryant","9787111544937","机械工业出版社","2016-11-01","计算机科学经典著作",1,"covers/2.jpg","PDF","books/pdf/2.pdf",78643200,736,13900,11900,"计算机系统,经典",0
```

## 方案三：创建简单的数据初始化脚本

### 创建 Java 初始化类

```java
@Component
public class EBookDataInitializer implements CommandLineRunner {
    
    @Autowired
    private EBookMapper eBookMapper;
    
    @Value("${ebook.init-data:false}")
    private boolean initData;
    
    @Override
    public void run(String... args) {
        if (!initData) {
            return;
        }
        
        // 检查是否已有数据
        if (eBookMapper.selectCount() > 0) {
            System.out.println("数据库已有数据，跳过初始化");
            return;
        }
        
        System.out.println("开始初始化电子书数据...");
        
        // 初始化测试数据
        List<EBook> ebooks = createTestEBooks();
        for (EBook ebook : ebooks) {
            eBookMapper.insert(ebook);
        }
        
        System.out.println("电子书数据初始化完成，共 " + ebooks.size() + " 条");
    }
    
    private List<EBook> createTestEBooks() {
        List<EBook> ebooks = new ArrayList<>();
        
        // 电子书 1
        EBook book1 = new EBook();
        book1.setBookTitle("Java 编程思想（第4版）");
        book1.setAuthor("Bruce Eckel");
        book1.setIsbn("9787111213826");
        book1.setPublisher("机械工业出版社");
        book1.setPublishDate(parseDate("2007-06-01"));
        book1.setBookIntro("Java程序员必读的经典著作");
        book1.setCategoryId(1L);
        book1.setCoverImg("covers/1.jpg");
        book1.setFileFormat("PDF");
        book1.setFilePath("books/pdf/1.pdf");
        book1.setFileSize(52428800L);
        book1.setPageCount(880);
        book1.setOriginalPrice(10800);
        book1.setSellingPrice(8800);
        book1.setTags("Java,编程,经典");
        book1.setSellStatus((byte) 0);
        book1.setIsDeleted((byte) 0);
        book1.setCreateTime(new Date());
        book1.setUpdateTime(new Date());
        ebooks.add(book1);
        
        // 添加更多电子书...
        
        return ebooks;
    }
    
    private Date parseDate(String dateStr) {
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
        } catch (Exception e) {
            return new Date();
        }
    }
}
```

在 `application.properties` 中配置：

```properties
# 是否初始化测试数据（仅开发环境使用）
ebook.init-data=true
```

## 方案四：使用 Postman 测试数据

如果你已经实现了电子书的 API 接口，可以使用 Postman 来添加测试数据。

### Postman 请求示例

```json
POST http://localhost:8080/api/v1/admin/ebooks
Content-Type: application/json

{
  "bookTitle": "Java 编程思想",
  "author": "Bruce Eckel",
  "isbn": "9787111213826",
  "publisher": "机械工业出版社",
  "publishDate": "2007-06-01",
  "bookIntro": "Java程序员必读的经典著作",
  "categoryId": 1,
  "coverImg": "covers/1.jpg",
  "fileFormat": "PDF",
  "filePath": "books/pdf/1.pdf",
  "fileSize": 52428800,
  "pageCount": 880,
  "originalPrice": 10800,
  "sellingPrice": 8800,
  "tags": "Java,编程,经典",
  "sellStatus": 0
}
```

## 推荐方案总结

### 开发阶段（推荐）
**方案一 + 方案二组合**：
1. 使用本地文件系统存储电子书文件
2. 使用 SQL 脚本初始化基础数据
3. 使用 DBeaver 进行日常数据维护

### 优点
- 简单快速，无需开发管理后台
- 文件管理直观，易于调试
- 数据库工具功能强大，支持批量操作
- 适合快速开发和测试

### 注意事项
1. **文件路径一致性**：确保数据库中的文件路径与实际文件位置一致
2. **文件命名规范**：使用统一的命名规则，便于管理
3. **备份数据**：定期备份数据库和文件
4. **版本控制**：将 SQL 脚本纳入 Git 版本控制
5. **生产环境**：生产环境建议使用云存储（如阿里云 OSS）

## 后续升级路径

当项目需要时，可以逐步添加管理功能：

1. **第一步**：添加简单的文件上传 API
2. **第二步**：添加电子书 CRUD API
3. **第三步**：开发简单的管理界面
4. **第四步**：完善管理后台功能

这样可以根据实际需求逐步完善，避免过度设计。
