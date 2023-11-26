CREATE DATABASE [AppPersonas]
GO

USE [AppPersonas]
GO

/****** Object:  Table [dbo].[Persona]    Script Date: 23/11/2023 10:52:33 a. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Persona](
	[numDocumento] [bigint] IDENTITY(1,1) NOT NULL,
	[tipoDocumento] [varchar](max) NOT NULL,
	[primerNombre] [varchar](max) NOT NULL,
	[segundoNombre] [varchar](max) NULL,
	[apellidos] [varchar](max) NOT NULL,
	[fechaNacimiento] [varchar](max) NOT NULL,
	[genero] [varchar](max) NOT NULL,
	[correoElectronico] [varchar](max) NOT NULL,
	[celular] [bigint] NOT NULL,
	[foto] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[numDocumento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

