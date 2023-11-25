USE [AppPersonas]
GO

/****** Object:  Table [dbo].[Consola]    Script Date: 25/11/2023 2:47:16 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Consola](
	[idLog] [int] IDENTITY(1,1) NOT NULL,
	[dateLog] [date] NOT NULL,
	[accionLog] [varchar](max) NOT NULL,
	[documentoPersona] [bigint] NOT NULL,
	[tipoDocumentoPersona] [varchar](max) NOT NULL,
	[valorLog] [nvarchar](max) NOT NULL,
	[cambiosAntes] [text] NULL,
	[cambiosDespues] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[idLog] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

