CREATE TABLE `artigo` (
	`nifEmpresa` varchar(9) NOT NULL,
	`contaId` varchar(36) NOT NULL,
	`codigoArtigo` varchar(50) NOT NULL,
	`quantidade` int NOT NULL,
	`desconto` int NOT NULL,
	CONSTRAINT `pk_artigo` PRIMARY KEY(`nifEmpresa`,`contaId`,`codigoArtigo`)
);
--> statement-breakpoint
CREATE TABLE `conta` (
	`nifEmpresa` varchar(9) NOT NULL,
	`mesaId` varchar(36) NOT NULL,
	`contaId` varchar(36) NOT NULL,
	`entidade` int NOT NULL,
	`nome` varchar(100) NOT NULL,
	`morada` varchar(255) NOT NULL,
	`codigoPostal` varchar(8) NOT NULL,
	`localidade` varchar(100) NOT NULL,
	`nif` varchar(9) NOT NULL,
	CONSTRAINT `pk_conta` PRIMARY KEY(`nifEmpresa`,`contaId`)
);
--> statement-breakpoint
CREATE TABLE `sala` (
	`nifEmpresa` varchar(9) NOT NULL,
	`salaId` varchar(36) NOT NULL,
	`nomeSala` varchar(100) NOT NULL,
	CONSTRAINT `pk_sala` PRIMARY KEY(`nifEmpresa`,`salaId`),
	CONSTRAINT `uk_sala_nifEmpresa_nomeSala` UNIQUE(`nifEmpresa`,`nomeSala`)
);
--> statement-breakpoint
CREATE TABLE `mesa` (
	`nifEmpresa` varchar(9) NOT NULL,
	`salaId` varchar(36) NOT NULL,
	`mesaId` varchar(36) NOT NULL,
	`nomeMesa` varchar(32) NOT NULL,
	`estado` varchar(20) NOT NULL,
	`obs` varchar(255) NOT NULL,
	CONSTRAINT `pk_mesa` PRIMARY KEY(`nifEmpresa`,`mesaId`),
	CONSTRAINT `uk_mesa_nifEmpresa_salaId_nomeMesa` UNIQUE(`nifEmpresa`,`salaId`,`nomeMesa`)
);
--> statement-breakpoint
ALTER TABLE `artigo` ADD CONSTRAINT `fk_artigo_conta` FOREIGN KEY (`nifEmpresa`,`contaId`) REFERENCES `conta`(`nifEmpresa`,`contaId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conta` ADD CONSTRAINT `fk_conta_mesa` FOREIGN KEY (`nifEmpresa`,`mesaId`) REFERENCES `mesa`(`nifEmpresa`,`mesaId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mesa` ADD CONSTRAINT `fk_mesa_sala` FOREIGN KEY (`nifEmpresa`,`salaId`) REFERENCES `sala`(`nifEmpresa`,`salaId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_conta_nifEmpresa_mesaId` ON `conta` (`nifEmpresa`,`mesaId`);--> statement-breakpoint
CREATE INDEX `idx_mesa_nifEmpresa_salaId` ON `mesa` (`nifEmpresa`,`salaId`);