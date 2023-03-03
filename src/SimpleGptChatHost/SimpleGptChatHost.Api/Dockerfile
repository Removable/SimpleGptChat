#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["SimpleGptChatHost.Api/SimpleGptChatHost.Api.csproj", "SimpleGptChatHost.Api/"]
COPY ["OpenAI.SDK/OpenAI.SDK/OpenAI.GPT3.csproj", "OpenAI.SDK/OpenAI.SDK/"]
RUN dotnet restore "SimpleGptChatHost.Api/SimpleGptChatHost.Api.csproj"
COPY . .
WORKDIR "/src/SimpleGptChatHost.Api"
RUN dotnet build "SimpleGptChatHost.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SimpleGptChatHost.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SimpleGptChatHost.Api.dll"]
