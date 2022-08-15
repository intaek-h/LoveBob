-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Restaurants` (
    `id` VARCHAR(50) NOT NULL,
    `poi_nm` VARCHAR(100) NOT NULL,
    `branch_nm` VARCHAR(100) NULL,
    `sub_nm` VARCHAR(100) NULL,
    `mcate_cd` VARCHAR(30) NULL,
    `mcate_nm` VARCHAR(200) NULL,
    `pnu` VARCHAR(30) NULL,
    `sido_nm` VARCHAR(100) NULL,
    `sgg_nm` VARCHAR(100) NULL,
    `bemd_nm` VARCHAR(100) NULL,
    `ri_nm` VARCHAR(100) NULL,
    `beonji` VARCHAR(20) NULL,
    `badm_cd` VARCHAR(30) NULL,
    `hadm_cd` VARCHAR(30) NULL,
    `rd_cd` VARCHAR(30) NULL,
    `rd_nm` VARCHAR(100) NULL,
    `bld_num` VARCHAR(30) NULL,
    `grid_cd` VARCHAR(30) NULL,
    `origin` VARCHAR(200) NULL,
    `base_ymd` VARCHAR(20) NULL,
    `loc` point NOT NULL,

    INDEX `loc`(`loc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisitedRestaurants` (
    `userId` VARCHAR(191) NOT NULL,
    `restaurantsId` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`userId`, `restaurantsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `restaurantsId` VARCHAR(50) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `image1` VARCHAR(255) NOT NULL,
    `image2` VARCHAR(255) NOT NULL,
    `image3` VARCHAR(255) NOT NULL,
    `image4` VARCHAR(255) NOT NULL,
    `image5` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Posts_id_key`(`id`),
    PRIMARY KEY (`userId`, `restaurantsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitedRestaurants` ADD CONSTRAINT `VisitedRestaurants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisitedRestaurants` ADD CONSTRAINT `VisitedRestaurants_restaurantsId_fkey` FOREIGN KEY (`restaurantsId`) REFERENCES `Restaurants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_restaurantsId_fkey` FOREIGN KEY (`restaurantsId`) REFERENCES `Restaurants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
